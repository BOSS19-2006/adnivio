import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    };
  };
}