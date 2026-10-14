import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { OrderRecord, Transaction, TransactionStatus } from '../../types/order';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/date';

type TransactionTableProps = {
  transactions: Transaction[];
  orders: OrderRecord[];
  customerNames?: Record<string, string>;
  onStatusChange?: (id: string, status: TransactionStatus) => void;
  emptyLabel?: string;
};

const statuses: TransactionStatus[] = ['pending', 'completed', 'failed', 'refunded'];

export function TransactionTable({ transactions, orders, customerNames, onStatusChange, emptyLabel = 'No transactions yet.' }: TransactionTableProps) {
  if (transactions.length === 0) {
    return <p className="rounded-xl bg-panel px-5 py-10 text-center text-sm text-muted">{emptyLabel}</p>;
  }

  const orderMap = Object.fromEntries(orders.map((o) => [o.id, o]));

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-line">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-panel text-xs text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            {customerNames && <th className="px-4 py-3 font-medium">Customer</th>}
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Method</th>
            <th className="px-4 py-3 font-medium">Reference</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-panel">
          {transactions.map((t) => {
            const order = orderMap[t.order_id];
            return (
              <tr key={t.id}>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDateTime(t.created_at)}</td>
                {customerNames && <td className="px-4 py-3 font-medium">{customerNames[t.user_id] || 'Unknown'}</td>}
                <td className="px-4 py-3">
                  <p className="font-medium">{order?.vehicle_name ?? '—'}</p>
                  <p className="text-xs text-muted">#{t.order_id.slice(0, 8).toUpperCase()}</p>
                </td>
                <td className="px-4 py-3">{t.method}</td>
                <td className="max-w-[160px] truncate px-4 py-3 text-muted">{t.reference || '—'}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">{formatPrice(Number(t.amount))}</td>
                <td className="px-4 py-3">
                  {onStatusChange ?
                  <select
                    value={t.status}
                    onChange={(e) => onStatusChange(t.id, e.target.value as TransactionStatus)}
                    aria-label="Transaction status"
                    className="h-8 rounded bg-panel px-2 text-xs font-medium capitalize outline-none ring-1 ring-line focus:ring-ink">
                    
                      {statuses.map((s) =>
                    <option key={s} value={s}>{s}</option>
                    )}
                    </select> :

                  <StatusBadge status={t.status} />
                  }
                </td>
              </tr>);

          })}
        </tbody>
      </table>
    </div>);

}