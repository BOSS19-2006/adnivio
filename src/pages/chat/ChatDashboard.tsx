import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Search, 
  Plus, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  MoreVertical,
  Bot,
  Users,
  Image as ImageIcon,
  File,
  Mic,
  X,
  Check,
  CheckCheck
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';

const ChatDashboard = () => {
  const { user } = useAuth();
  const { 
    chatRooms, 
    currentRoom, 
    messages, 
    loading, 
    setCurrentRoom,
    fetchMessages,
    sendMessage,
    sendAIMessage,
    markAsRead,
    chatWithAI,
    createOrGetChatRoom
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{id: string, content: string, isAI: boolean, timestamp: Date}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollAIToBottom = () => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollAIToBottom();
  }, [aiMessages]);

  useEffect(() => {
    if (currentRoom) {
      fetchMessages(currentRoom.id);
      markAsRead(currentRoom.id);
    }
  }, [currentRoom]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentRoom) return;

    try {
      await sendMessage(currentRoom.id, messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendAIMessage = async () => {
    if (!aiInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: aiInput,
      isAI: false,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setIsTyping(true);

    try {
      const aiResponse = await chatWithAI(aiInput, { userRole: user?.role });
      
      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          isAI: true,
          timestamp: new Date()
        };
        setAiMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      console.error('Failed to get AI response:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, isAI = false) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isAI) {
        handleSendAIMessage();
      } else {
        handleSendMessage();
      }
    }
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const filteredRooms = chatRooms.filter(room => {
    const otherParticipant = room.participants.find(p => p.user_id !== user?.id);
    return otherParticipant?.user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAIChat(true)}
                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                title="AI Assistant"
              >
                <Bot className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredRooms.map((room) => {
            const otherParticipant = room.participants.find(p => p.user_id !== user?.id);
            const isActive = currentRoom?.id === room.id;
            
            return (
              <motion.div
                key={room.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                onClick={() => setCurrentRoom(room)}
                className={`p-4 cursor-pointer border-b border-gray-100 ${
                  isActive ? 'bg-purple-50 border-r-2 border-r-purple-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={otherParticipant?.user.avatar_url || `https://ui-avatars.com/api/?name=${otherParticipant?.user.full_name}&background=random`}
                      alt={otherParticipant?.user.full_name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {otherParticipant?.user.full_name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(room.last_message_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {room.last_message?.content || 'No messages yet'}
                      </p>
                      {room.unread_count && room.unread_count > 0 && (
                        <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {room.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const otherParticipant = currentRoom.participants.find(p => p.user_id !== user?.id);
                    return (
                      <>
                        <img
                          src={otherParticipant?.user.avatar_url || `https://ui-avatars.com/api/?name=${otherParticipant?.user.full_name}&background=random`}
                          alt={otherParticipant?.user.full_name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {otherParticipant?.user.full_name}
                          </h2>
                          <p className="text-sm text-green-600">Online</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.sender_id === user?.id;
                const isAI = message.is_ai_message;
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                      {!isOwn && !isAI && (
                        <div className="flex items-center space-x-2 mb-1">
                          <img
                            src={message.sender?.avatar_url || `https://ui-avatars.com/api/?name=${message.sender?.full_name}&background=random`}
                            alt={message.sender?.full_name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-xs text-gray-500">{message.sender?.full_name}</span>
                        </div>
                      )}
                      
                      {isAI && (
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-xs text-purple-600">Adnivio AI</span>
                        </div>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-purple-600 text-white'
                            : isAI
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      
                      <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.created_at)}
                        </span>
                        {isOwn && (
                          <CheckCheck className="w-3 h-3 text-purple-600" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>
                
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {showAIChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-2xl h-[600px] flex flex-col"
            >
              {/* AI Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Adnivio AI Assistant</h2>
                    <p className="text-sm text-gray-600">Your personal business helper</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIChat(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* AI Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiMessages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Hi! I'm your AI assistant</h3>
                    <p className="text-gray-600">I can help you with:</p>
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p>• Product recommendations and insights</p>
                      <p>• Investment opportunities and analysis</p>
                      <p>• Marketing and ad optimization</p>
                      <p>• Business growth strategies</p>
                    </div>
                  </div>
                )}
                
                {aiMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.isAI ? 'order-1' : 'order-2'}`}>
                      {message.isAI && (
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-xs text-purple-600">AI Assistant</span>
                        </div>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.isAI
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-purple-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      
                      <div className={`flex items-center mt-1 ${message.isAI ? 'justify-start' : 'justify-end'}`}>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-purple-100 text-purple-900 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={aiMessagesEndRef} />
              </div>

              {/* AI Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, true)}
                      placeholder="Ask me anything about your business..."
                      className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>
                  <button
                    onClick={handleSendAIMessage}
                    disabled={!aiInput.trim() || isTyping}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatDashboard;