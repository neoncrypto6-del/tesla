import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Loader2Icon, LogOutIcon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { CustomersPanel } from '../components/admin/CustomersPanel';
import { PaymentsPanel } from '../components/admin/PaymentsPanel';
import { SupportPanel } from '../components/admin/SupportPanel';
import { PaymentSettingsPanel } from '../components/admin/PaymentSettingsPanel'; // NEW
import { TransactionTable } from '../components/dashboard/TransactionTable';
import { useAuth } from '../contexts/AuthContext';
import { useAdminData } from '../hooks/useAdminData';
import { TransactionStatus } from '../types/order';

// NEW: added 'payment-settings' to the tab union
type Tab = 'customers' | 'payments' | 'transactions' | 'support' | 'payment-settings';

export function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const data = useAdminData(isAdmin);
  const [tab, setTab] = useState<Tab>('customers');
  const [chatUser, setChatUser] = useState<string | null>(null);
  const [txFilter, setTxFilter] = useState<TransactionStatus | 'all'>('all');
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        <Loader2Icon className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  const pendingCount = data.transactions.filter((t) => t.status === 'pending').length;
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'customers', label: 'Customers', count: data.customers.length },
    { id: 'payments', label: 'Payments', count: data.orders.length },
    { id: 'transactions', label: 'Transactions', count: pendingCount || undefined },
    { id: 'support', label: 'Support' },
    { id: 'payment-settings', label: 'Payment Details' }, // NEW
  ];

  const visibleTx = data.transactions.filter(
    (t) => txFilter === 'all' || t.status === txFilter
  );

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="TACYE home">
              <Logo />
            </Link>
            <span className="rounded bg-ink px-2 py-0.5 text-xs font-medium text-white">
              Admin
            </span>
          </div>
          <button
            onClick={async () => {
              await signOut();
              navigate('/admin/login');
            }}
            className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium hover:bg-panel"
          >
            <LogOutIcon className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-8">
        <h1 className="text-3xl font-medium tracking-tight">Admin Dashboard</h1>
        <nav
          className="mt-6 flex gap-1 overflow-x-auto border-b border-line"
          aria-label="Admin sections"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
              className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                tab === t.id
                  ? 'border-ink text-ink'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className="rounded-full bg-panel px-2 text-xs text-muted">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {data.error && (
          <p role="alert" className="mt-6 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {data.error}
          </p>
        )}

        <div className="mt-8">
          {data.loading ? (
            <div className="flex justify-center py-20 text-muted">
              <Loader2Icon className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {tab === 'customers' && (
                <CustomersPanel
                  customers={data.customers}
                  orders={data.orders}
                  transactions={data.transactions}
                  onStatusChange={data.updateTransactionStatus}
                  onMessage={(id) => {
                    setChatUser(id);
                    setTab('support');
                  }}
                />
              )}
              {tab === 'payments' && (
                <PaymentsPanel
                  orders={data.orders}
                  transactions={data.transactions}
                  customerNames={data.customerNames}
                />
              )}
              {tab === 'transactions' && (
                <div>
                  <div
                    className="mb-4 flex flex-wrap gap-2"
                    role="radiogroup"
                    aria-label="Filter by status"
                  >
                    {(['all', 'pending', 'completed', 'failed', 'refunded'] as const).map((s) => (
                      <button
                        key={s}
                        role="radio"
                        aria-checked={txFilter === s}
                        onClick={() => setTxFilter(s)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors duration-150 ${
                          txFilter === s
                            ? 'bg-ink text-white'
                            : 'bg-panel text-ink hover:bg-line/60'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <TransactionTable
                    transactions={visibleTx}
                    orders={data.orders}
                    customerNames={data.customerNames}
                    onStatusChange={data.updateTransactionStatus}
                  />
                </div>
              )}
              {tab === 'support' && (
                <SupportPanel
                  customerNames={data.customerNames}
                  selectedUserId={chatUser}
                  onSelect={setChatUser}
                />
              )}
              {/* NEW: payment settings editor */}
              {tab === 'payment-settings' && <PaymentSettingsPanel />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
