import React, { useState } from 'react';
import { StatusBadge } from '../StatusBadge';
import { OrderRecord, Transaction } from '../../types/order';
import { formatPrice } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { paymentState, planLabel } from '../../utils/orders';

type PaymentsPanelProps = {
  orders: OrderRecord[];
  transactions: Transaction[];
  customerNames: Record<string, string>;
};

type Filter = 'all' | 'full' | 'installment';

export function PaymentsPanel({ orders, transactions, customerNames }: PaymentsPanelProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = orders.filter((o) => filter === 'all' || o.payment_plan === filter);

  return (
    <div>
      <div className="flex gap-2" role="radiogroup" aria-label="Payment type">
        {(['all', 'full', 'installment'] as Filter[]).map((f) =>
        <button
          key={f}
          role="radio"
          aria-checked={filter === f}
          onClick={() => setFilter(f)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${filter === f ? 'bg-ink text-white' : 'bg-panel text-ink hover:bg-line/60'}`}>
          
            {f === 'all' ? 'All' : f === 'full' ? 'Pay fully' : 'Little by little'}
          </button>
        )}
      </div>
      {filtered.length === 0 ?
      <p className="mt-6 rounded-xl bg-panel px-5 py-10 text-center text-sm text-muted">No payments initiated yet.</p> :

      <div className="mt-4 overflow-x-auto rounded-xl ring-1 ring-line">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-panel text-xs text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Payment type</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-right font-medium">Paid</th>
                <th className="px-4 py-3 text-right font-medium">Balance</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel">
              {filtered.map((o) => {
              const s = paymentState(o, transactions);
              return (
                <tr key={o.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{customerNames[o.user_id] || o.customer_name || 'Unknown'}</p>
                      <p className="text-xs text-muted">{o.customer_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.vehicle_name}</p>
                      <p className="text-xs text-muted">{o.trim_name} · {formatDate(o.created_at)}</p>
                    </td>
                    <td className="px-4 py-3">{planLabel(o.payment_plan)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatPrice(s.total)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatPrice(s.paid)}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">{formatPrice(s.balance)}</td>
                    <td className="px-4 py-3">
                      {s.isPaid ? <StatusBadge status="paid" label="Paid" /> : <StatusBadge status="due" label="Pending" />}
                    </td>
                  </tr>);

            })}
            </tbody>
          </table>
        </div>
      }
    </div>);

}