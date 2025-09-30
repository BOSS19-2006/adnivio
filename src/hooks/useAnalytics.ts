import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './useAuth';

type ProductAnalytics = Database['public']['Tables']['product_analytics']['Row'];
type SellerAnalytics = Database['public']['Tables']['seller_analytics']['Row'];

export function useAnalytics() {
  const { user } = useAuth();
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics[]>([]);
  const [sellerAnalytics, setSellerAnalytics] = useState<SellerAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductAnalytics = async (productId?: string, days = 30) => {
    if (!user || user.role !== 'seller') return;

    try {
      setLoading(true);
      let query = supabase
        .from('product_analytics')
        .select(`
          *,
          product:products(name, price)
        `)
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      } else {
        // Get analytics for all seller's products
        query = query.in('product_id', 
          supabase
            .from('products')
            .select('id')
            .eq('seller_id', user.id)
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      setProductAnalytics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerAnalytics = async (days = 30) => {
    if (!user || user.role !== 'seller') return;

    try {
      const { data, error } = await supabase
        .from('seller_analytics')
        .select('*')
        .eq('seller_id', user.id)
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      setSellerAnalytics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch seller analytics');
    }
  };

  const trackEvent = async (eventType: string, eventData: any) => {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          user_id: user?.id,
          event_type: eventType,
          event_data: eventData,
          session_id: sessionStorage.getItem('session_id') || undefined
        });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  };

  const trackProductView = async (productId: string) => {
    await trackEvent('product_view', { product_id: productId });
    
    // Update product analytics
    try {
      await supabase.rpc('update_product_analytics', {
        p_product_id: productId,
        p_event_type: 'view'
      });
    } catch (err) {
      console.error('Failed to update product analytics:', err);
    }
  };

  const trackProductClick = async (productId: string) => {
    await trackEvent('product_click', { product_id: productId });
    
    try {
      await supabase.rpc('update_product_analytics', {
        p_product_id: productId,
        p_event_type: 'click'
      });
    } catch (err) {
      console.error('Failed to update product analytics:', err);
    }
  };

  const trackCartAdd = async (productId: string) => {
    await trackEvent('cart_add', { product_id: productId });
    
    try {
      await supabase.rpc('update_product_analytics', {
        p_product_id: productId,
        p_event_type: 'cart_add'
      });
    } catch (err) {
      console.error('Failed to update product analytics:', err);
    }
  };

  const trackPurchase = async (productId: string, revenue: number) => {
    await trackEvent('purchase', { product_id: productId, revenue });
    
    try {
      await supabase.rpc('update_product_analytics', {
        p_product_id: productId,
        p_event_type: 'purchase',
        p_revenue: revenue
      });
    } catch (err) {
      console.error('Failed to update product analytics:', err);
    }
  };

  useEffect(() => {
    if (user?.role === 'seller') {
      fetchProductAnalytics();
      fetchSellerAnalytics();
    }
  }, [user]);

  return {
    productAnalytics,
    sellerAnalytics,
    loading,
    error,
    fetchProductAnalytics,
    fetchSellerAnalytics,
    trackEvent,
    trackProductView,
    trackProductClick,
    trackCartAdd,
    trackPurchase
  };
}