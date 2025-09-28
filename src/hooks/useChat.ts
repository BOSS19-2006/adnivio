import { useState, useEffect, useCallback } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './useAuth';

type ChatRoom = Database['public']['Tables']['chat_rooms']['Row'] & {
  participants: (Database['public']['Tables']['chat_participants']['Row'] & {
    user: Database['public']['Tables']['profiles']['Row'];
  })[];
  last_message?: ChatMessage;
  unread_count?: number;
};

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'] & {
  sender?: Database['public']['Tables']['profiles']['Row'];
  reply_to?: ChatMessage;
};

type ChatParticipant = Database['public']['Tables']['chat_participants']['Row'] & {
  user: Database['public']['Tables']['profiles']['Row'];
};

export function useChat() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's chat rooms
  const fetchChatRooms = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          participants:chat_participants(
            *,
            user:profiles(*)
          )
        `)
        .eq('chat_participants.user_id', user.id)
        .eq('is_active', true)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Get unread counts for each room
      const roomsWithUnread = await Promise.all(
        (data || []).map(async (room) => {
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('chat_room_id', room.id)
            .gt('created_at', room.participants.find(p => p.user_id === user.id)?.last_read_at || '1970-01-01');

          return {
            ...room,
            unread_count: count || 0,
          };
        })
      );

      setChatRooms(roomsWithUnread);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chat rooms');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a chat room
  const fetchMessages = async (roomId: string, limit = 50, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles(*),
          reply_to:chat_messages(
            *,
            sender:profiles(*)
          )
        `)
        .eq('chat_room_id', roomId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const sortedMessages = (data || []).reverse();
      
      if (offset === 0) {
        setMessages(sortedMessages);
      } else {
        setMessages(prev => [...sortedMessages, ...prev]);
      }

      return sortedMessages;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      return [];
    }
  };

  // Create or get existing chat room
  const createOrGetChatRoom = async (
    type: 'buyer_seller' | 'investor_sme' | 'group',
    participantIds: string[],
    metadata?: any,
    name?: string
  ) => {
    if (!user) throw new Error('User must be logged in');

    try {
      // For direct chats, check if room already exists
      if (type !== 'group' && participantIds.length === 1) {
        const { data: existingRooms } = await supabase
          .from('chat_rooms')
          .select(`
            *,
            participants:chat_participants(user_id)
          `)
          .eq('type', type)
          .eq('is_active', true);

        const existingRoom = existingRooms?.find(room => {
          const userIds = room.participants.map(p => p.user_id);
          return userIds.includes(user.id) && userIds.includes(participantIds[0]);
        });

        if (existingRoom) {
          return existingRoom;
        }
      }

      // Create new chat room
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          name,
          type,
          created_by: user.id,
          metadata,
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add participants
      const participants = [user.id, ...participantIds].map(userId => ({
        chat_room_id: room.id,
        user_id: userId,
        is_admin: userId === user.id,
      }));

      const { error: participantsError } = await supabase
        .from('chat_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      await fetchChatRooms();
      return room;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create chat room');
    }
  };

  // Send message
  const sendMessage = async (
    roomId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' | 'voice' = 'text',
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    replyToId?: string
  ) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_room_id: roomId,
          sender_id: user.id,
          message_type: messageType,
          content,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          reply_to_id: replyToId,
        })
        .select(`
          *,
          sender:profiles(*),
          reply_to:chat_messages(
            *,
            sender:profiles(*)
          )
        `)
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  // Send AI message
  const sendAIMessage = async (roomId: string, content: string, context?: any) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_room_id: roomId,
          sender_id: null, // AI messages don't have a sender
          message_type: 'text',
          content,
          is_ai_message: true,
          metadata: context,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to send AI message');
    }
  };

  // Mark messages as read
  const markAsRead = async (roomId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('chat_room_id', roomId)
        .eq('user_id', user.id);

      // Update local state
      setChatRooms(prev => prev.map(room => 
        room.id === roomId ? { ...room, unread_count: 0 } : room
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          if (currentRoom && newMessage.chat_room_id === currentRoom.id) {
            setMessages(prev => [...prev, newMessage]);
          }
          
          // Update chat rooms list
          fetchChatRooms();
        }
      )
      .subscribe();

    // Subscribe to chat room updates
    const roomsSubscription = supabase
      .channel('chat_rooms')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_rooms',
        },
        () => {
          fetchChatRooms();
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
      roomsSubscription.unsubscribe();
    };
  }, [user, currentRoom]);

  // AI Chatbot functionality
  const chatWithAI = async (message: string, context?: any) => {
    try {
      // This would integrate with OpenAI or another AI service
      // For now, we'll simulate AI responses
      const aiResponses = {
        buyer: [
          "I can help you find the perfect products! What are you looking for?",
          "Based on your preferences, I recommend checking out our electronics section.",
          "Would you like me to set up price alerts for items you're interested in?",
        ],
        seller: [
          "I can help you optimize your product listings and ad campaigns!",
          "Consider adjusting your pricing strategy based on market trends.",
          "Your product photos could be improved for better conversion rates.",
        ],
        investor: [
          "I can help you analyze investment opportunities and SME profiles.",
          "This SME shows strong growth potential in the fintech sector.",
          "Consider diversifying your portfolio across different industries.",
        ],
      };

      const userRole = context?.userRole || 'buyer';
      const responses = aiResponses[userRole as keyof typeof aiResponses] || aiResponses.buyer;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      return randomResponse;
    } catch (err) {
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [user]);

  return {
    chatRooms,
    currentRoom,
    messages,
    loading,
    error,
    setCurrentRoom,
    fetchChatRooms,
    fetchMessages,
    createOrGetChatRoom,
    sendMessage,
    sendAIMessage,
    markAsRead,
    chatWithAI,
  };
}