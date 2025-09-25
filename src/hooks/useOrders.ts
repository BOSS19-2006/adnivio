import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';

type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    product: Database['public']['Tables']['products']['Row'];
  })[];
};

type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (filters?: {
    buyer_id?: string;
    seller_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `);

      if (filters?.buyer_id) {
        query = query.eq('buyer_id', filters.buyer_id);
      }

      if (filters?.seller_id) {
        query = query.eq('order_items.seller_id', filters.seller_id);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (id: string): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching order:', err);
      return null;
    }
  };

  const createOrder = async (orderData: OrderInsert, items: Array<{
    product_id: string;
    seller_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product_snapshot?: any;
  }>) => {
    try {
      // Start a transaction
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map(item => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock
      for (const item of items) {
        await supabase.rpc('decrement_product_stock', {
          product_id: item.product_id,
          quantity: item.quantity,
        });
      }

      // Fetch the complete order
      const completeOrder = await getOrder(order.id);
      if (completeOrder) {
        setOrders(prev => [completeOrder, ...prev]);
      }

      return order;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create order');
    }
  };

  const updateOrder = async (id: string, updates: OrderUpdate) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrder,
    createOrder,
    updateOrder,
  };
}