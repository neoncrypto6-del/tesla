import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import {
  chargingSummary,
  fsdOption,
  interiorOptions,
  MIN_DEPOSIT,
  paintOptions,
} from '../data/configurator';
import { Vehicle } from '../types/vehicle';
import { OrderConfig, PaymentPlan } from '../types/order';
import { createOrder, savePendingCart } from '../utils/orders';
import { discountedPrice, formatPrice } from '../utils/currency';

type Status = 'idle' | 'submitting' | 'error';

export function useOrder(vehicle: Vehicle | undefined, initialTrimId: string | null) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [trimId, setTrimId] = useState(
    vehicle?.trims.find((t) => t.id === initialTrimId)?.id ?? vehicle?.trims[0]?.id ?? ''
  );
  const [paintId, setPaintId] = useState(paintOptions[0].id);
  const [interiorId, setInteriorId] = useState(interiorOptions[0].id);
  const [fsd, setFsd] = useState(false);
  const [view, setView] = useState<'exterior' | 'interior'>('exterior');
  const [plan, setPlan] = useState<PaymentPlan>('full');
  const [payNow, setPayNow] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const trim = vehicle?.trims.find((t) => t.id === trimId) ?? vehicle?.trims[0];
  const paint = paintOptions.find((p) => p.id === paintId) ?? paintOptions[0];
  const interior = interiorOptions.find((i) => i.id === interiorId) ?? interiorOptions[0];

  // 40% off the vehicle base price. Options stay at full price.
  const baseDiscounted = discountedPrice(trim?.price ?? 0);
  const optionsTotal = paint.price + interior.price + (fsd ? fsdOption.price : 0);
  const total = baseDiscounted + optionsTotal;

  const payNowAmount = Number(payNow) || 0;
  const dueToday = plan === 'full' ? total : payNowAmount;
  const balance = Math.max(0, total - dueToday);

  const payNowError =
    plan === 'installment' &&
    payNow !== '' &&
    (payNowAmount < MIN_DEPOSIT || payNowAmount > total)
      ? `Enter an amount between ${formatPrice(MIN_DEPOSIT)} and ${formatPrice(total)}.`
      : '';

  const selectInterior = (id: string) => {
    setInteriorId(id);
    setView('interior');
  };

  const selectPaint = (id: string) => {
    setPaintId(id);
    setView('exterior');
  };

  const submit = async () => {
    if (!vehicle || !trim) return;
    if (plan === 'installment' && (payNow === '' || payNowError)) {
      setStatus('error');
      setError(payNowError || 'Enter the amount you want to pay now.');
      return;
    }
    const config: OrderConfig = {
      vehicle_slug: vehicle.slug,
      vehicle_name: vehicle.name,
      trim_name: trim.name,
      exterior_color: paint.name,
      interior: interior.name,
      full_self_driving: fsd,
      charging_option: chargingSummary,
      total_price: total, // already discounted
      payment_plan: plan,
      initial_amount: dueToday,
    };

    if (!user) {
      savePendingCart(config);
      toast('Sign in to continue', {
        description: `Your ${vehicle.name} will be saved to your cart.`,
      });
      navigate('/signin?redirect=/cart');
      return;
    }

    setStatus('submitting');
    setError('');
    try {
      const orderId = await createOrder(user.id, user.email, profile?.full_name, config);
      navigate(`/payment/${orderId}`);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unable to create your order.');
    }
  };

  return {
    user,
    trim,
    paint,
    interior,
    fsd,
    view,
    plan,
    payNow,
    payNowError,
    total,
    dueToday,
    balance,
    status,
    error,
    setTrimId,
    selectPaint,
    selectInterior,
    setFsd,
    setView,
    setPlan,
    setPayNow,
    submit,
  };
}
