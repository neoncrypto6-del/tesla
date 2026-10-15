import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import type { PaymentSettings } from '../types/payment';

export function usePaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error) {
      setError(error.message);
      setSettings(null);
    } else {
      setSettings(data as PaymentSettings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { settings, loading, error, reload: load };
}
