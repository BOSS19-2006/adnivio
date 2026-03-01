import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Campaign {
  id: string;
  business_id: string;
  campaign_name: string;
  campaign_type: 'product' | 'service' | 'brand';
  target_product_id?: string;
  target_service_id?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  ai_generated?: boolean;
  objective?: string;
  budget: number;
  spent?: number;
  platforms?: string[];
  target_audience?: Record<string, any>;
  creative_content?: Record<string, any>;
  performance_metrics?: Record<string, any>;
  ai_insights?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

interface CreateCampaignInput {
  campaign_name: string;
  campaign_type: 'product' | 'service' | 'brand';
  objective?: string;
  budget: number;
  platforms?: string[];
  target_audience?: Record<string, any>;
  creative_content?: Record<string, any>;
  start_date?: string;
  end_date?: string;
  target_product_id?: string;
  target_service_id?: string;
}

interface UpdateCampaignInput {
  campaign_name?: string;
  status?: 'draft' | 'active' | 'paused' | 'completed';
  budget?: number;
  objective?: string;
  platforms?: string[];
  target_audience?: Record<string, any>;
  creative_content?: Record<string, any>;
  ai_insights?: string;
  performance_metrics?: Record<string, any>;
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async (filters?: {
    business_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      let query = supabase.from('campaigns').select('*');

      if (filters?.business_id) {
        query = query.eq('business_id', filters.business_id);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      query = query.order('created_at', { ascending: false });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 10) - 1
        );
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setCampaigns(data || []);
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch campaigns';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCampaign = async (id: string): Promise<Campaign | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      console.error('Error fetching campaign:', err);
      return null;
    }
  };

  const createCampaign = async (
    businessId: string,
    campaignData: CreateCampaignInput
  ): Promise<Campaign> => {
    try {
      const { data, error: insertError } = await supabase
        .from('campaigns')
        .insert({
          business_id: businessId,
          campaign_name: campaignData.campaign_name,
          campaign_type: campaignData.campaign_type,
          objective: campaignData.objective,
          budget: campaignData.budget,
          platforms: campaignData.platforms || [],
          target_audience: campaignData.target_audience || {},
          creative_content: campaignData.creative_content || {},
          start_date: campaignData.start_date,
          end_date: campaignData.end_date,
          target_product_id: campaignData.target_product_id,
          target_service_id: campaignData.target_service_id,
          status: 'draft',
          spent: 0,
          performance_metrics: {},
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error('No data returned from insert');

      setCampaigns((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create campaign';
      throw new Error(message);
    }
  };

  const updateCampaign = async (
    id: string,
    updates: UpdateCampaignInput
  ): Promise<Campaign> => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error: updateError } = await supabase
        .from('campaigns')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (!data) throw new Error('No data returned from update');

      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? data : c))
      );
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update campaign';
      throw new Error(message);
    }
  };

  const deleteCampaign = async (id: string): Promise<void> => {
    try {
      const { error: deleteError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete campaign';
      throw new Error(message);
    }
  };

  const pauseCampaign = async (id: string): Promise<Campaign> => {
    return updateCampaign(id, { status: 'paused' });
  };

  const activateCampaign = async (id: string): Promise<Campaign> => {
    return updateCampaign(id, { status: 'active' });
  };

  const completeCampaign = async (id: string): Promise<Campaign> => {
    return updateCampaign(id, { status: 'completed' });
  };

  const updatePerformanceMetrics = async (
    id: string,
    metrics: Record<string, any>
  ): Promise<Campaign> => {
    try {
      const campaign = await getCampaign(id);
      if (!campaign) throw new Error('Campaign not found');

      const updatedMetrics = {
        ...campaign.performance_metrics,
        ...metrics,
        updated_at: new Date().toISOString(),
      };

      return updateCampaign(id, {
        performance_metrics: updatedMetrics,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update metrics';
      throw new Error(message);
    }
  };

  const updateAIInsights = async (id: string, insights: string): Promise<Campaign> => {
    return updateCampaign(id, { ai_insights: insights });
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    pauseCampaign,
    activateCampaign,
    completeCampaign,
    updatePerformanceMetrics,
    updateAIInsights,
  };
}
