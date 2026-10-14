import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase';
import { Customer, OrderRecord, Transaction, TransactionStatus } from '../types/order';

export function useAdminData(enabled: boolean) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    const [c, o, t, a] = await Promise.all([
    supabase.from('customers').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('transactions').select('*').order('created_at', { ascending: false }),
    supabase.from('admins').select('user_id')]
    );
    const firstError = c.error || o.error || t.error;
    setError(firstError ? firstError.message : '');
    const adminIds = new Set((a.data as {user_id: string;}[] ?? []).map((r) => r.user_id));
    setCustomers((c.data as Customer[] ?? []).filter((x) => !adminIds.has(x.id)));
    setOrders(o.data as OrderRecord[] ?? []);
    setTransactions(t.data as Transaction[] ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    reload();
    const channel = supabase.
    channel('admin-transactions').
    on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => reload()).
    subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, reload]);

  const updateTransactionStatus = async (id: string, status: TransactionStatus) => {
    const previous = transactions;
    setTransactions((list) => list.map((t) => t.id === id ? { ...t, status } : t));
    const { error: updateError } = await supabase.
    from('transactions').
    update({ status, updated_at: new Date().toISOString() }).
    eq('id', id);
    if (updateError) {
      setTransactions(previous);
      toast.error('Status not updated', { description: updateError.message });
    } else {
      toast.success(`Transaction marked ${status}`);
    }
  };

  const customerNames = useMemo(
    () => Object.fromEntries(customers.map((c) => [c.id, c.full_name || c.email])),
    [customers]
  );

  return { customers, orders, transactions, customerNames, loading, error, reload, updateTransactionStatus };
}