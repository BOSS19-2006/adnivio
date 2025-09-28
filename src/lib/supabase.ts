import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using demo mode.');
  // Create a mock client for development without Supabase
  export const supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Demo mode - Supabase not configured') }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Demo mode - Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Demo mode') }) }) }),
      insert: () => Promise.resolve({ data: null, error: new Error('Demo mode') }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('Demo mode') }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: new Error('Demo mode') }) })
    })
  } as any;
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}


// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          role: 'buyer' | 'seller' | 'admin';
          is_verified: boolean;
          address: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          role?: 'buyer' | 'seller' | 'admin';
          is_verified?: boolean;
          address?: any | null;
        };
        Update: {
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          role?: 'buyer' | 'seller' | 'admin';
          is_verified?: boolean;
          address?: any | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          category_id: string;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          stock_quantity: number;
          sku: string | null;
          images: string[];
          features: string[];
          specifications: any;
          tags: string[];
          status: 'active' | 'inactive' | 'out_of_stock' | 'pending_approval' | 'rejected';
          is_featured: boolean;
          weight: number | null;
          dimensions: any | null;
          views_count: number;
          sales_count: number;
          rating_average: number;
          rating_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          seller_id: string;
          category_id: string;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          stock_quantity?: number;
          sku?: string | null;
          images?: string[];
          features?: string[];
          specifications?: any;
          tags?: string[];
          status?: 'active' | 'inactive' | 'out_of_stock' | 'pending_approval' | 'rejected';
          is_featured?: boolean;
          weight?: number | null;
          dimensions?: any | null;
        };
        Update: {
          category_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          stock_quantity?: number;
          sku?: string | null;
          images?: string[];
          features?: string[];
          specifications?: any;
          tags?: string[];
          status?: 'active' | 'inactive' | 'out_of_stock' | 'pending_approval' | 'rejected';
          is_featured?: boolean;
          weight?: number | null;
          dimensions?: any | null;
        };
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          order_number: string;
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          total_amount: number;
          shipping_amount: number;
          tax_amount: number;
          discount_amount: number;
          shipping_address: any;
          billing_address: any | null;
          payment_method: string | null;
          payment_status: string;
          notes: string | null;
          estimated_delivery: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          buyer_id: string;
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          total_amount: number;
          shipping_amount?: number;
          tax_amount?: number;
          discount_amount?: number;
          shipping_address: any;
          billing_address?: any | null;
          payment_method?: string | null;
          payment_status?: string;
          notes?: string | null;
          estimated_delivery?: string | null;
        };
        Update: {
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          payment_status?: string;
          notes?: string | null;
          estimated_delivery?: string | null;
          delivered_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          seller_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_snapshot: any | null;
          created_at: string;
        };
        Insert: {
          order_id: string;
          product_id: string;
          seller_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_snapshot?: any | null;
        };
        Update: {
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          buyer_id: string;
          order_item_id: string | null;
          rating: number;
          title: string | null;
          comment: string | null;
          images: string[];
          is_verified: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          product_id: string;
          buyer_id: string;
          order_item_id?: string | null;
          rating: number;
          title?: string | null;
          comment?: string | null;
          images?: string[];
          is_verified?: boolean;
        };
        Update: {
          rating?: number;
          title?: string | null;
          comment?: string | null;
          images?: string[];
        };
      };
      ad_campaigns: {
        Row: {
          id: string;
          seller_id: string;
          name: string;
          description: string | null;
          status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
          budget: number;
          spent_amount: number;
          target_audience: any | null;
          ad_creative: any | null;
          start_date: string | null;
          end_date: string | null;
          impressions: number;
          clicks: number;
          conversions: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          seller_id: string;
          name: string;
          description?: string | null;
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
          budget: number;
          target_audience?: any | null;
          ad_creative?: any | null;
          start_date?: string | null;
          end_date?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
          budget?: number;
          target_audience?: any | null;
          ad_creative?: any | null;
          start_date?: string | null;
          end_date?: string | null;
          impressions?: number;
          clicks?: number;
          conversions?: number;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'sale' | 'purchase' | 'ad_spend' | 'withdrawal' | 'deposit' | 'refund' | 'commission';
          status: 'pending' | 'completed' | 'failed' | 'cancelled';
          amount: number;
          currency: string;
          description: string | null;
          reference_id: string | null;
          reference_type: string | null;
          payment_method: string | null;
          gateway_transaction_id: string | null;
          gateway_response: any | null;
          metadata: any | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: 'sale' | 'purchase' | 'ad_spend' | 'withdrawal' | 'deposit' | 'refund' | 'commission';
          amount: number;
          currency?: string;
          description?: string | null;
          reference_id?: string | null;
          reference_type?: string | null;
          payment_method?: string | null;
          gateway_transaction_id?: string | null;
          gateway_response?: any | null;
          metadata?: any | null;
        };
        Update: {
          status?: 'pending' | 'completed' | 'failed' | 'cancelled';
          gateway_transaction_id?: string | null;
          gateway_response?: any | null;
          processed_at?: string | null;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
        };
        Update: never;
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
          quantity: number;
        };
        Update: {
          quantity?: number;
        };
      };
      investment_profiles: {
        Row: {
          id: string;
          sme_id: string;
          company_name: string;
          industry: string;
          stage: 'idea' | 'mvp' | 'early_revenue' | 'growth' | 'expansion';
          description: string;
          funding_amount: number;
          equity_offered: number;
          current_revenue: number;
          profit_margin: number;
          customer_count: number;
          growth_projections: any;
          pitch_deck_url: string;
          financial_documents: string[];
          business_plan_url: string;
          team_info: any;
          milestones: any;
          use_of_funds: string;
          status: 'active' | 'funded' | 'closed' | 'paused';
          views_count: number;
          interest_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          sme_id: string;
          company_name: string;
          industry: string;
          stage: 'idea' | 'mvp' | 'early_revenue' | 'growth' | 'expansion';
          description: string;
          funding_amount: number;
          equity_offered?: number;
          current_revenue?: number;
          profit_margin?: number;
          customer_count?: number;
          growth_projections?: any;
          pitch_deck_url?: string;
          financial_documents?: string[];
          business_plan_url?: string;
          team_info?: any;
          milestones?: any;
          use_of_funds?: string;
          status?: 'active' | 'funded' | 'closed' | 'paused';
        };
        Update: {
          company_name?: string;
          industry?: string;
          stage?: 'idea' | 'mvp' | 'early_revenue' | 'growth' | 'expansion';
          description?: string;
          funding_amount?: number;
          equity_offered?: number;
          current_revenue?: number;
          profit_margin?: number;
          customer_count?: number;
          growth_projections?: any;
          pitch_deck_url?: string;
          financial_documents?: string[];
          business_plan_url?: string;
          team_info?: any;
          milestones?: any;
          use_of_funds?: string;
          status?: 'active' | 'funded' | 'closed' | 'paused';
        };
      };
      investor_profiles: {
        Row: {
          id: string;
          investor_id: string;
          investor_type: string;
          investment_range_min: number;
          investment_range_max: number;
          preferred_industries: string[];
          preferred_stages: ('idea' | 'mvp' | 'early_revenue' | 'growth' | 'expansion')[];
          risk_appetite: string;
          investment_history: any;
          portfolio_companies: string[];
          bio: string;
          linkedin_url: string;
          website_url: string;
          verified: boolean;
          total_investments: number;
          successful_exits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          investor_id: string;
          investor_type: string;
          investment_range_min: number;
          investment_range_max: number;
          preferred_industries?: string[];
          preferred_stages?: ('idea' | 'mvp' | 'early_revenue' | 'growth' | 'expansion')[];
          risk_appetite?: string;
          investment_history?: any;
          portfolio_companies?: string[];
          bio?: string;
          linkedin_url?: string;
          website_url?: string;
          verified?: boolean;
          total_investments?: number;
          successful_exits?: number;
        };
        Update: {
          investor_type?: string;
          investment_range_min?: number;
          investment_range_max?: number;
          preferred_industries?: string[];
          preferred_stages?: ('idea' | 'mvp' | 'early_revenue' | 'growth' | 'expansion')[];
          risk_appetite?: string;
          investment_history?: any;
          portfolio_companies?: string[];
          bio?: string;
          linkedin_url?: string;
          website_url?: string;
          verified?: boolean;
          total_investments?: number;
          successful_exits?: number;
        };
      };
      investment_interests: {
        Row: {
          id: string;
          investor_id: string;
          investment_profile_id: string;
          interest_level: string;
          proposed_amount: number;
          proposed_equity: number;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          investor_id: string;
          investment_profile_id: string;
          interest_level: string;
          proposed_amount?: number;
          proposed_equity?: number;
          message?: string;
          status?: string;
        };
        Update: {
          interest_level?: string;
          proposed_amount?: number;
          proposed_equity?: number;
          message?: string;
          status?: string;
        };
      };
      investment_deals: {
        Row: {
          id: string;
          investment_profile_id: string;
          investor_id: string;
          deal_amount: number;
          equity_percentage: number;
          valuation: number;
          status: 'pending' | 'negotiating' | 'due_diligence' | 'completed' | 'cancelled';
          terms: any;
          documents: string[];
          escrow_wallet_id: string;
          signed_at: string;
          completed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          investment_profile_id: string;
          investor_id: string;
          deal_amount: number;
          equity_percentage: number;
          valuation?: number;
          status?: 'pending' | 'negotiating' | 'due_diligence' | 'completed' | 'cancelled';
          terms?: any;
          documents?: string[];
          escrow_wallet_id?: string;
        };
        Update: {
          deal_amount?: number;
          equity_percentage?: number;
          valuation?: number;
          status?: 'pending' | 'negotiating' | 'due_diligence' | 'completed' | 'cancelled';
          terms?: any;
          documents?: string[];
          escrow_wallet_id?: string;
          signed_at?: string;
          completed_at?: string;
        };
      };
      chat_rooms: {
        Row: {
          id: string;
          name: string;
          type: 'buyer_seller' | 'investor_sme' | 'group' | 'ai_support';
          created_by: string;
          metadata: any;
          is_active: boolean;
          last_message_at: string;
          created_at: string;
        };
        Insert: {
          name?: string;
          type: 'buyer_seller' | 'investor_sme' | 'group' | 'ai_support';
          created_by: string;
          metadata?: any;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          is_active?: boolean;
          last_message_at?: string;
        };
      };
      chat_participants: {
        Row: {
          id: string;
          chat_room_id: string;
          user_id: string;
          joined_at: string;
          last_read_at: string;
          is_admin: boolean;
        };
        Insert: {
          chat_room_id: string;
          user_id: string;
          is_admin?: boolean;
        };
        Update: {
          last_read_at?: string;
          is_admin?: boolean;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          chat_room_id: string;
          sender_id: string;
          message_type: 'text' | 'image' | 'file' | 'voice' | 'system';
          content: string;
          file_url: string;
          file_name: string;
          file_size: number;
          reply_to_id: string;
          is_edited: boolean;
          is_ai_message: boolean;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          chat_room_id: string;
          sender_id?: string;
          message_type?: 'text' | 'image' | 'file' | 'voice' | 'system';
          content: string;
          file_url?: string;
          file_name?: string;
          file_size?: number;
          reply_to_id?: string;
          is_ai_message?: boolean;
          metadata?: any;
        };
        Update: {
          content?: string;
          is_edited?: boolean;
        };
      };
      ai_chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_context: any;
          last_interaction_at: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          session_context?: any;
        };
        Update: {
          session_context?: any;
          last_interaction_at?: string;
        };
      };
    };
  };
}