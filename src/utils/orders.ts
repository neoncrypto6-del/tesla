import { supabase } from './supabase';
import { CartItem, OrderConfig, OrderRecord, Transaction } from '../types/order';

const PENDING_KEY = 'tacye_pending_cart';

export function savePendingCart(config: OrderConfig) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(config));
}

export async function flushPendingCart(userId: string): Promise<boolean> {
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return false;
  try {
    const config = JSON.parse(raw) as OrderConfig;
    const { error } = await supabase.from('cart_items').insert({ ...config, user_id: userId });
    if (error) return false;
    localStorage.removeItem(PENDING_KEY);
    return true;
  } catch {
    localStorage.removeItem(PENDING_KEY);
    return false;
  }
}

export function cartItemToConfig(item: CartItem): OrderConfig {
  return {
    vehicle_slug: item.vehicle_slug,
    vehicle_name: item.vehicle_name,
    trim_name: item.trim_name,
    exterior_color: item.exterior_color,
    interior: item.interior,
    full_self_driving: item.full_self_driving,
    charging_option: item.charging_option,
    total_price: Number(item.total_price),
    payment_plan: item.payment_plan,
    initial_amount: Number(item.initial_amount)
  };
}

export async function createOrder(
userId: string,
email: string | undefined,
name: string | undefined,
config: OrderConfig)
: Promise<string> {
  const { data, error } = await supabase.
  from('orders').
  insert({ ...config, user_id: userId, customer_email: email ?? '', customer_name: name ?? '', status: 'pending' }).
  select('id').
  single();
  if (error) throw error;
  return data.id as string;
}

export function paymentState(order: OrderRecord, transactions: Transaction[]) {
  const related = transactions.filter((t) => t.order_id === order.id);
  const paid = related.filter((t) => t.status === 'completed').reduce((s, t) => s + Number(t.amount), 0);
  const pending = related.filter((t) => t.status === 'pending').reduce((s, t) => s + Number(t.amount), 0);
  const total = Number(order.total_price);
  const balance = Math.max(0, total - paid);
  return {
    total,
    paid,
    pending,
    balance,
    remaining: Math.max(0, balance - pending),
    isPaid: balance <= 0,
    progress: total > 0 ? Math.min(100, paid / total * 100) : 0
  };
}

export function planLabel(plan: string) {
  return plan === 'installment' ? 'Little by little' : 'Paid in full';
}