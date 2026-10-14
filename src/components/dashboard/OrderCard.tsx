import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { ActionButton } from '../ActionButton';
import { vehicles } from '../../data/vehicles';
import { OrderRecord, Transaction } from '../../types/order';
import { formatPrice } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { paymentState, planLabel } from '../../utils/orders';

type OrderCardProps = {order: OrderRecord;transactions: Transaction[];};

export function OrderCard({ order, transactions }: OrderCardProps) {
  const state = paymentState(order, transactions);
  const image = vehicles.find((v) => v.slug === order.vehicle_slug)?.image;

  return (
    <article className="grid gap-6 rounded-xl ring-1 ring-line md:grid-cols-[260px_1fr]">
      {image && <img src={image} alt={order.vehicle_name} className="h-48 w-full rounded-t-xl object-cover md:h-full md:rounded-l-xl md:rounded-tr-none" />}
      <div className="flex flex-col p-6 md:pl-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-medium">{order.vehicle_name}</h3>
            <p className="text-sm text-muted">
              {order.trim_name} · Order #{order.id.slice(0, 8).toUpperCase()} · {formatDate(order.created_at)}
            </p>
          </div>
          {state.isPaid ?
          <StatusBadge status="paid" label="Paid in full" /> :

          <StatusBadge status="due" label="Pending payment" />
          }
        </div>

        <p className="mt-3 text-sm text-muted">
          {order.exterior_color} · {order.interior} interior{order.full_self_driving ? ' · Full Self-Driving' : ''} · {planLabel(order.payment_plan)}
        </p>

        <div className="mt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-panel" role="progressbar" aria-valuenow={Math.round(state.progress)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-ink transition-[width] duration-300 ease-out" style={{ width: `${state.progress}%` }} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-muted">Total</dt>
              <dd className="font-medium tabular-nums">{formatPrice(state.total)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Paid</dt>
              <dd className="font-medium tabular-nums">{formatPrice(state.paid)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Awaiting confirmation</dt>
              <dd className="font-medium tabular-nums">{formatPrice(state.pending)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Balance</dt>
              <dd className="font-medium tabular-nums">{formatPrice(state.balance)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-auto pt-5">
          {state.isPaid ?
          <p className="text-sm text-muted">You have paid for this vehicle in full. We'll contact you to schedule delivery.</p> :
          state.remaining > 0 ?
          <ActionButton to={`/payment/${order.id}`} variant="primary">
              {transactions.some((t) => t.order_id === order.id) ? 'Make a Payment' : 'Complete Payment'}
            </ActionButton> :

          <p className="text-sm text-muted">Your payment is awaiting confirmation.</p>
          }
        </div>
      </div>
    </article>);

}