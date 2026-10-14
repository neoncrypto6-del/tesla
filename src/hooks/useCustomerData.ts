import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { CartItem, OrderRecord, Transaction } from '../types/order';

export function useCustomerData(userId: string | undefined) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!userId) return;
    const [o, t, c] = await Promise.all([
    supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('cart_items').select('*').eq('user_id', userId).order('created_at', { ascending: false })]
    );
    const firstError = o.error || t.error || c.error;
    setError(firstError ? firstError.message : '');
    setOrders(o.data as OrderRecord[] ?? []);
    setTransactions(t.data as Transaction[] ?? []);
    setCart(c.data as CartItem[] ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    reload();
    if (!userId) return;
    const channel = supabase.
    channel(`customer-tx-${userId}`).
    on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` }, () => reload()).
    subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, reload]);

  return { orders, transactions, cart, loading, error, reload };
}