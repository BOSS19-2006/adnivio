import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './useAuth';

type Coupon = Database['public']['Tables']['coupons']['Row'];
type CouponUsage = Database['public']['Tables']['coupon_usage']['Row'];

export function useCoupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = async () => {
    if (!user || user.role !== 'seller') {
      setCoupons([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (couponData: Omit<Database['public']['Tables']['coupons']['Insert'], 'seller_id'>) => {
    if (!user || user.role !== 'seller') throw new Error('Only sellers can create coupons');

    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert({
          ...couponData,
          seller_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setCoupons(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create coupon');
    }
  };

  const updateCoupon = async (couponId: string, updates: Partial<Coupon>) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .update(updates)
        .eq('id', couponId)
        .eq('seller_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setCoupons(prev => prev.map(c => c.id === couponId ? data : c));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update coupon');
    }
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId)
        .eq('seller_id', user?.id);

      if (error) throw error;

      setCoupons(prev => prev.filter(c => c.id !== couponId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete coupon');
    }
  };

  const applyCoupon = async (
    couponCode: string,
    orderTotal: number,
    sellerId: string
  ) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const { data, error } = await supabase.rpc('apply_coupon', {
        p_coupon_code: couponCode,
        p_user_id: user.id,
        p_order_total: orderTotal,
        p_seller_id: sellerId
      });

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to apply coupon');
    }
  };

  const validateCoupon = async (couponCode: string, sellerId: string) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode)
        .eq('seller_id', sellerId)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      // Check if coupon is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        throw new Error('Coupon has expired');
      }

      // Check usage limit
      if (data.usage_limit && data.used_count >= data.usage_limit) {
        throw new Error('Coupon usage limit exceeded');
      }

      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Invalid coupon');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [user]);

  return {
    coupons,
    loading,
    error,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
    validateCoupon,
    refetch: fetchCoupons
  };
}