import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { CheckCircle2Icon, Loader2Icon, ShieldCheckIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { ActionButton } from '../components/ActionButton';
import { FormField, inputClass } from '../components/FormField';
import { useAuth } from '../contexts/AuthContext';
import { MIN_INSTALLMENT, paymentMethods } from '../data/configurator';
import { vehicles } from '../data/vehicles';
import { OrderRecord, Transaction } from '../types/order';
import { supabase } from '../utils/supabase';
import { paymentState, planLabel } from '../utils/orders';
import { formatPrice } from '../utils/currency';

export function Payment() {
  const { orderId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(paymentMethods[0].id);
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !orderId) return;
    Promise.all([
    supabase.from('orders').select('*').eq('id', orderId).maybeSingle(),
    supabase.from('transactions').select('*').eq('order_id', orderId)]
    ).then(([o, t]) => {
      const loadedOrder = o.data as OrderRecord | null;
      const loadedTx = t.data as Transaction[] ?? [];
      setOrder(loadedOrder);
      setTransactions(loadedTx);
      if (loadedOrder) {
        const s = paymentState(loadedOrder, loadedTx);
        const suggested = loadedOrder.payment_plan === 'full' || loadedTx.length > 0 ? s.remaining : Math.min(Number(loadedOrder.initial_amount), s.remaining);
        setAmount(String(suggested));
      }
      setLoading(false);
    });
  }, [user, orderId]);

  if (!authLoading && !user) return <Navigate to={`/signin?redirect=/payment/${orderId}`} replace />;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen w-full bg-white">
        <Header />
        <div className="flex justify-center pt-40 text-muted"><Loader2Icon className="h-6 w-6 animate-spin" /></div>
      </div>);

  }

  if (!order) {
    return (
      <div className="min-h-screen w-full bg-white">
        <Header />
        <main className="flex flex-col items-center px-6 pt-40 text-center">
          <h1 className="text-3xl font-medium">Order not found</h1>
          <ActionButton to="/dashboard" className="mt-6">Go to Dashboard</ActionButton>
        </main>
      </div>);

  }

  const state = paymentState(order, transactions);
  const isFull = order.payment_plan === 'full';
  const amountValue = Number(amount) || 0;
  const minAmount = Math.min(MIN_INSTALLMENT, state.remaining);
  const image = vehicles.find((v) => v.slug === order.vehicle_slug)?.image;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const value = isFull ? state.remaining : amountValue;
    if (value < minAmount || value > state.remaining) {
      setError(`Enter an amount between ${formatPrice(minAmount)} and ${formatPrice(state.remaining)}.`);
      return;
    }
    setSubmitting(true);
    setError('');
    const { error: insertError } = await supabase.from('transactions').insert({
      order_id: order.id,
      user_id: user.id,
      amount: value,
      method,
      reference: reference.trim() || null,
      status: 'pending'
    });
    setSubmitting(false);
    if (insertError) setError(insertError.message);else
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen w-full bg-white">
        <Header />
        <main className="mx-auto flex max-w-md flex-col items-center px-6 pt-36 text-center">
          <CheckCircle2Icon className="h-12 w-12 text-brand" strokeWidth={1.5} />
          <h1 className="mt-4 text-3xl font-medium tracking-tight">Payment submitted</h1>
          <p className="mt-2 text-sm text-muted">
            Your payment of {formatPrice(isFull ? state.remaining : amountValue)} for your {order.vehicle_name} is awaiting confirmation. You can follow its status in your dashboard.
          </p>
          <ActionButton to="/dashboard?tab=transactions" variant="primary" fullWidth className="mt-8">View Transactions</ActionButton>
        </main>
      </div>);

  }

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <main className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-28 lg:grid-cols-[1fr_440px]">
        <section aria-label="Order summary">
          <h1 className="text-4xl font-medium tracking-tight">Payment</h1>
          <p className="mt-1 text-sm text-muted">Order #{order.id.slice(0, 8).toUpperCase()} · {planLabel(order.payment_plan)}</p>
          {image && <img src={image} alt={order.vehicle_name} className="mt-6 h-64 w-full rounded-xl object-cover" />}
          <h2 className="mt-6 text-xl font-medium">{order.vehicle_name}</h2>
          <dl className="mt-4 divide-y divide-panel text-sm">
            {[
            ['Model', order.trim_name],
            ['Exterior', order.exterior_color],
            ['Interior', order.interior],
            ['Full Self-Driving', order.full_self_driving ? 'Included' : 'Not selected'],
            ['Charging', order.charging_option],
            ['Vehicle total', formatPrice(state.total)],
            ['Paid so far', formatPrice(state.paid)],
            ['Awaiting confirmation', formatPrice(state.pending)]].
            map(([k, v]) =>
            <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            )}
            <div className="flex justify-between py-3 text-base">
              <dt className="font-medium">Balance</dt>
              <dd className="font-medium">{formatPrice(state.balance)}</dd>
            </div>
          </dl>
        </section>

        <section className="lg:pt-16" aria-label="Payment details">
          {state.remaining <= 0 ?
          <div className="rounded-xl bg-panel p-6 text-center">
              <p className="font-medium">{state.isPaid ? 'This vehicle is paid in full.' : 'Your payment is awaiting confirmation.'}</p>
              <ActionButton to="/dashboard" variant="primary" fullWidth className="mt-5">Go to Dashboard</ActionButton>
            </div> :

          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl p-6 ring-1 ring-line" noValidate>
              {isFull ?
            <div>
                  <p className="text-sm text-muted">Amount due (paid fully)</p>
                  <p className="mt-1 text-3xl font-medium tracking-tight">{formatPrice(state.remaining)}</p>
                </div> :

            <FormField id="amount" label="Amount to pay now">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
                    <input id="amount" type="number" inputMode="decimal" min={minAmount} max={state.remaining} value={amount} onChange={(e) => setAmount(e.target.value)} className={`${inputClass} pl-7`} />
                  </div>
                  <p className="mt-1 text-xs text-muted">Up to {formatPrice(state.remaining)} remaining.</p>
                </FormField>
            }

              <fieldset>
                <legend className="mb-2 text-sm text-muted">Payment method</legend>
                <div className="space-y-2">
                  {paymentMethods.map((m) =>
                <label key={m.id} className={`flex cursor-pointer gap-3 rounded-lg p-3 ring-inset transition-shadow duration-150 ${method === m.id ? 'ring-2 ring-ink' : 'ring-1 ring-line hover:ring-muted'}`}>
                      <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="mt-1 accent-brand" />
                      <span>
                        <span className="block text-sm font-medium">{m.name}</span>
                        <span className="block text-xs text-muted">{m.description}</span>
                      </span>
                    </label>
                )}
                </div>
              </fieldset>

              <FormField id="reference" label="Payment reference (optional)">
                <input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. transfer confirmation number" className={inputClass} />
              </FormField>

              {error && <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <ActionButton type="submit" variant="primary" fullWidth disabled={submitting}>
                {submitting ? <Loader2Icon className="h-4 w-4 animate-spin" /> : `Submit Payment of ${formatPrice(isFull ? state.remaining : amountValue)}`}
              </ActionButton>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                Payments are confirmed by our team before they post.
              </p>
            </form>
          }
        </section>
      </main>
    </div>);

}