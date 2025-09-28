import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './useAuth';

type InvestmentProfile = Database['public']['Tables']['investment_profiles']['Row'] & {
  sme: Database['public']['Tables']['profiles']['Row'];
};

type InvestorProfile = Database['public']['Tables']['investor_profiles']['Row'] & {
  investor: Database['public']['Tables']['profiles']['Row'];
};

type InvestmentInterest = Database['public']['Tables']['investment_interests']['Row'] & {
  investor: Database['public']['Tables']['profiles']['Row'];
  investment_profile: InvestmentProfile;
};

type InvestmentDeal = Database['public']['Tables']['investment_deals']['Row'] & {
  investment_profile: InvestmentProfile;
  investor: Database['public']['Tables']['profiles']['Row'];
};

export function useInvestment() {
  const { user } = useAuth();
  const [investmentProfiles, setInvestmentProfiles] = useState<InvestmentProfile[]>([]);
  const [investorProfiles, setInvestorProfiles] = useState<InvestorProfile[]>([]);
  const [interests, setInterests] = useState<InvestmentInterest[]>([]);
  const [deals, setDeals] = useState<InvestmentDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch investment profiles (SMEs seeking funding)
  const fetchInvestmentProfiles = async (filters?: {
    industry?: string;
    stage?: string;
    min_amount?: number;
    max_amount?: number;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('investment_profiles')
        .select(`
          *,
          sme:profiles(*)
        `)
        .eq('status', 'active');

      if (filters?.industry) {
        query = query.eq('industry', filters.industry);
      }

      if (filters?.stage) {
        query = query.eq('stage', filters.stage);
      }

      if (filters?.min_amount) {
        query = query.gte('funding_amount', filters.min_amount);
      }

      if (filters?.max_amount) {
        query = query.lte('funding_amount', filters.max_amount);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setInvestmentProfiles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch investor profiles
  const fetchInvestorProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('investor_profiles')
        .select(`
          *,
          investor:profiles(*)
        `)
        .eq('verified', true)
        .order('total_investments', { ascending: false });

      if (error) throw error;

      setInvestorProfiles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Create investment profile (for SMEs)
  const createInvestmentProfile = async (profileData: Database['public']['Tables']['investment_profiles']['Insert']) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const { data, error } = await supabase
        .from('investment_profiles')
        .insert({
          ...profileData,
          sme_id: user.id,
        })
        .select(`
          *,
          sme:profiles(*)
        `)
        .single();

      if (error) throw error;

      setInvestmentProfiles(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create investment profile');
    }
  };

  // Create investor profile
  const createInvestorProfile = async (profileData: Database['public']['Tables']['investor_profiles']['Insert']) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const { data, error } = await supabase
        .from('investor_profiles')
        .insert({
          ...profileData,
          investor_id: user.id,
        })
        .select(`
          *,
          investor:profiles(*)
        `)
        .single();

      if (error) throw error;

      setInvestorProfiles(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create investor profile');
    }
  };

  // Express interest in investment
  const expressInterest = async (investmentProfileId: string, interestData: {
    interest_level: string;
    proposed_amount?: number;
    proposed_equity?: number;
    message?: string;
  }) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const { data, error } = await supabase
        .from('investment_interests')
        .insert({
          investor_id: user.id,
          investment_profile_id: investmentProfileId,
          ...interestData,
        })
        .select(`
          *,
          investor:profiles(*),
          investment_profile:investment_profiles(
            *,
            sme:profiles(*)
          )
        `)
        .single();

      if (error) throw error;

      setInterests(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to express interest');
    }
  };

  // Get interests for user's investment profiles
  const fetchInterestsForProfile = async (investmentProfileId: string) => {
    try {
      const { data, error } = await supabase
        .from('investment_interests')
        .select(`
          *,
          investor:profiles(*)
        `)
        .eq('investment_profile_id', investmentProfileId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch interests');
    }
  };

  // AI Matchmaking - Get recommended investors for SME
  const getRecommendedInvestors = async (investmentProfileId: string) => {
    try {
      // This would typically use an AI service, but for now we'll use basic matching
      const { data: profile } = await supabase
        .from('investment_profiles')
        .select('*')
        .eq('id', investmentProfileId)
        .single();

      if (!profile) return [];

      const { data: investors, error } = await supabase
        .from('investor_profiles')
        .select(`
          *,
          investor:profiles(*)
        `)
        .contains('preferred_industries', [profile.industry])
        .contains('preferred_stages', [profile.stage])
        .gte('investment_range_max', profile.funding_amount)
        .lte('investment_range_min', profile.funding_amount)
        .eq('verified', true)
        .limit(10);

      if (error) throw error;

      return investors || [];
    } catch (err) {
      console.error('Error getting recommended investors:', err);
      return [];
    }
  };

  // AI Matchmaking - Get recommended SMEs for investor
  const getRecommendedSMEs = async () => {
    if (!user) return [];

    try {
      const { data: investorProfile } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('investor_id', user.id)
        .single();

      if (!investorProfile) return [];

      let query = supabase
        .from('investment_profiles')
        .select(`
          *,
          sme:profiles(*)
        `)
        .eq('status', 'active');

      if (investorProfile.preferred_industries?.length > 0) {
        query = query.in('industry', investorProfile.preferred_industries);
      }

      if (investorProfile.preferred_stages?.length > 0) {
        query = query.in('stage', investorProfile.preferred_stages);
      }

      query = query
        .gte('funding_amount', investorProfile.investment_range_min)
        .lte('funding_amount', investorProfile.investment_range_max)
        .limit(10);

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error getting recommended SMEs:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchInvestmentProfiles();
    fetchInvestorProfiles();
  }, []);

  return {
    investmentProfiles,
    investorProfiles,
    interests,
    deals,
    loading,
    error,
    fetchInvestmentProfiles,
    fetchInvestorProfiles,
    createInvestmentProfile,
    createInvestorProfile,
    expressInterest,
    fetchInterestsForProfile,
    getRecommendedInvestors,
    getRecommendedSMEs,
  };
}