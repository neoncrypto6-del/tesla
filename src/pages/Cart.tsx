import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2Icon, ShoppingCartIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '../components/Header';
import { ActionButton } from '../components/ActionButton';
import { useAuth } from '../contexts/AuthContext';
import { useCustomerData } from '../hooks/useCustomerData';
import { vehicles } from '../data/vehicles';
import { CartItem } from '../types/order';
import { supabase } from '../utils/supabase';
import { cartItemToConfig, createOrder, planLabel } from '../utils/orders';
import { formatPrice } from '../utils/currency';

export function Cart() {
  const { user, profile, loading: authLoading } = useAuth();
  const { cart, loading, reload } = useCustomerData(user?.id);
  const [busyId, setBusyId] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!authLoading && !user) return <Navigate to="/signin?redirect=/cart" replace />;

  const remove = async (item: CartItem) => {
    setBusyId(item.id);
    const { error } = await supabase.from('cart_items').delete().eq('id', item.id);
    setBusyId(null);
    if (error) toast.error(error.message);else
    reload();
  };

  const proceed = async (item: CartItem) => {
    if (!user) return;
    setBusyId(item.id);
    try {
      const orderId = await createOrder(user.id, user.email, profile?.full_name, cartItemToConfig(item));
      await supabase.from('cart_items').delete().eq('id', item.id);
      navigate(`/payment/${orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to start checkout.');
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-28">
        <h1 className="text-4xl font-medium tracking-tight">Cart</h1>

        {loading || authLoading ?
        <div className="flex justify-center py-20 text-muted">
            <Loader2Icon className="h-6 w-6 animate-spin" />
          </div> :
        cart.length === 0 ?
        <div className="mt-10 flex flex-col items-center rounded-xl bg-panel px-6 py-16 text-center">
            <ShoppingCartIcon className="h-8 w-8 text-muted" strokeWidth={1.5} />
            <p className="mt-4 font-medium">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted">Configure a vehicle to add it here.</p>
            <ActionButton to="/vehicles/model-y" className="mt-6">Shop Vehicles</ActionButton>
          </div> :

        <ul className="mt-8 space-y-4">
            {cart.map((item) => {
            const image = vehicles.find((v) => v.slug === item.vehicle_slug)?.image;
            const busy = busyId === item.id;
            const total = Number(item.total_price);
            const now = Number(item.initial_amount);
            return (
              <li key={item.id} className="grid gap-6 rounded-xl ring-1 ring-line md:grid-cols-[240px_1fr]">
                  {image && <img src={image} alt={item.vehicle_name} className="h-44 w-full rounded-t-xl object-cover md:h-full md:rounded-l-xl md:rounded-tr-none" />}
                  <div className="flex flex-col p-6 md:pl-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-medium">{item.vehicle_name}</h2>
                        <p className="text-sm text-muted">{item.trim_name}</p>
                      </div>
                      <button
                      onClick={() => remove(item)}
                      disabled={busy}
                      aria-label={`Remove ${item.vehicle_name}`}
                      className="rounded p-2 text-muted hover:bg-panel hover:text-ink">
                      
                        <Trash2Icon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-muted">
                      {item.exterior_color} · {item.interior} interior{item.full_self_driving ? ' · Full Self-Driving' : ''} · {item.charging_option}
                    </p>
                    <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <dt className="text-xs text-muted">Vehicle total</dt>
                        <dd className="font-medium">{formatPrice(total)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">Payment</dt>
                        <dd className="font-medium">{item.payment_plan === 'installment' ? 'Little by little' : 'Pay fully'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">Paying now</dt>
                        <dd className="font-medium">{formatPrice(now)}</dd>
                      </div>
                    </dl>
                    <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                      <ActionButton variant="primary" onClick={() => proceed(item)} disabled={busy}>
                        {busy ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Proceed to Payment'}
                      </ActionButton>
                      <ActionButton variant="white" to={`/order/${item.vehicle_slug}`} className="ring-1 ring-line">
                        Edit Configuration
                      </ActionButton>
                    </div>
                    <span className="sr-only">{planLabel(item.payment_plan)}</span>
                  </div>
                </li>);

          })}
          </ul>
        }
      </main>
    </div>);

}