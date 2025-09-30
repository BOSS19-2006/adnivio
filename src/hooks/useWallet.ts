import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './useAuth';

type Wallet = Database['public']['Tables']['wallets']['Row'];
type WalletTransaction = Database['public']['Tables']['wallet_transactions']['Row'] & {
  transaction?: Database['public']['Tables']['transactions']['Row'];
};

export function useWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = async () => {
    if (!user) {
      setWallet(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setWallet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (limit = 50) => {
    if (!wallet) return;

    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select(`
          *,
          transaction:transactions(*)
        `)
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    }
  };

  const updateBalance = async (
    amount: number,
    type: 'credit' | 'debit',
    description?: string,
    transactionId?: string
  ) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const { data, error } = await supabase.rpc('update_wallet_balance', {
        p_user_id: user.id,
        p_amount: amount,
        p_type: type,
        p_description: description,
        p_transaction_id: transactionId
      });

      if (error) throw error;

      // Refresh wallet and transactions
      await fetchWallet();
      await fetchTransactions();

      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update balance');
    }
  };

  const transferToAdBalance = async (amount: number) => {
    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    try {
      const { error } = await supabase
        .from('wallets')
        .update({
          balance: wallet.balance - amount,
          ad_balance: wallet.ad_balance + amount
        })
        .eq('id', wallet.id);

      if (error) throw error;

      await fetchWallet();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to transfer to ad balance');
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [user]);

  useEffect(() => {
    if (wallet) {
      fetchTransactions();
    }
  }, [wallet]);

  return {
    wallet,
    transactions,
    loading,
    error,
    updateBalance,
    transferToAdBalance,
    refetch: fetchWallet
  };
}