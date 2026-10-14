import React, { useState } from 'react';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { ProfileDetails } from '../dashboard/ProfileDetails';
import { TransactionTable } from '../dashboard/TransactionTable';
import { StatusBadge } from '../StatusBadge';
import { Customer, OrderRecord, Transaction, TransactionStatus } from '../../types/order';
import { formatDate } from '../../utils/date';
import { formatPrice } from '../../utils/currency';
import { paymentState, planLabel } from '../../utils/orders';

type CustomersPanelProps = {
  customers: Customer[];
  orders: OrderRecord[];
  transactions: Transaction[];
  onStatusChange: (id: string, status: TransactionStatus) => void;
  onMessage: (userId: string) => void;
};

export function CustomersPanel({ customers, orders, transactions, onStatusChange, onMessage }: CustomersPanelProps) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = customers.find((c) => c.id === selectedId);

  if (selected) {
    const theirOrders = orders.filter((o) => o.user_id === selected.id);
    const theirTx = transactions.filter((t) => t.user_id === selected.id);
    return (
      <div>
        <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeftIcon className="h-4 w-4" /> All customers
        </button>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-medium">{selected.full_name || selected.email}</h2>
          <button onClick={() => onMessage(selected.id)} className="rounded bg-panel px-4 py-2 text-sm font-medium hover:bg-line/60">
            Open chat
          </button>
        </div>
        <section className="mt-6">
          <ProfileDetails details={selected} joined={formatDate(selected.created_at)} />
        </section>

        <h3 className="mt-10 text-lg font-medium">Orders & payment plans</h3>
        {theirOrders.length === 0 ?
        <p className="mt-3 text-sm text-muted">No orders.</p> :

        <ul className="mt-3 divide-y divide-panel rounded-xl ring-1 ring-line">
            {theirOrders.map((o) => {
            const s = paymentState(o, transactions);
            return (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-4 text-sm">
                  <div>
                    <p className="font-medium">{o.vehicle_name} · {o.trim_name}</p>
                    <p className="text-xs text-muted">#{o.id.slice(0, 8).toUpperCase()} · {planLabel(o.payment_plan)} · {formatDate(o.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="tabular-nums text-muted">{formatPrice(s.paid)} / {formatPrice(s.total)}</span>
                    {s.isPaid ? <StatusBadge status="paid" label="Paid in full" /> : <StatusBadge status="due" label={`Balance ${formatPrice(s.balance)}`} />}
                  </div>
                </li>);

          })}
          </ul>
        }

        <h3 className="mt-10 text-lg font-medium">Transaction history</h3>
        <div className="mt-3">
          <TransactionTable transactions={theirTx} orders={orders} onStatusChange={onStatusChange} />
        </div>
      </div>);

  }

  const q = query.toLowerCase();
  const filtered = customers.filter((c) => [c.full_name, c.email, c.phone, c.state].some((v) => v?.toLowerCase().includes(q)));

  return (
    <div>
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers"
          aria-label="Search customers"
          className="h-10 w-full rounded bg-panel pl-9 pr-3 text-sm outline-none ring-1 ring-transparent focus:ring-ink" />
        
      </div>
      {filtered.length === 0 ?
      <p className="mt-6 rounded-xl bg-panel px-5 py-10 text-center text-sm text-muted">No customers found.</p> :

      <div className="mt-4 overflow-x-auto rounded-xl ring-1 ring-line">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-panel text-xs text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Tel</th>
                <th className="px-4 py-3 font-medium">Delivery Address</th>
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium">Zip</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel">
              {filtered.map((c) =>
            <tr key={c.id} onClick={() => setSelectedId(c.id)} className="cursor-pointer hover:bg-panel/60">
                  <td className="px-4 py-3 font-medium">
                    <button onClick={() => setSelectedId(c.id)} className="text-left hover:underline">{c.full_name || '—'}</button>
                  </td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="whitespace-nowrap px-4 py-3">{c.phone || '—'}</td>
                  <td className="max-w-[220px] truncate px-4 py-3">{c.delivery_address || '—'}</td>
                  <td className="px-4 py-3">{c.state || '—'}</td>
                  <td className="px-4 py-3">{c.zipcode || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(c.created_at)}</td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      }
    </div>);

}