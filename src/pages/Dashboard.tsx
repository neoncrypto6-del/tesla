import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Loader2Icon, ShoppingCartIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { ActionButton } from '../components/ActionButton';
import { OrderCard } from '../components/dashboard/OrderCard';
import { TransactionTable } from '../components/dashboard/TransactionTable';
import { ProfileDetails } from '../components/dashboard/ProfileDetails';
import { ChatThread } from '../components/chat/ChatThread';
import { useAuth } from '../contexts/AuthContext';
import { useCustomerData } from '../hooks/useCustomerData';
import { useChat } from '../hooks/useChat';
import { paymentState } from '../utils/orders';
import { formatPrice } from '../utils/currency';

type Tab = 'orders' | 'transactions' | 'support' | 'profile';

const tabs: {id: Tab;label: string;}[] = [
{ id: 'orders', label: 'Orders' },
{ id: 'transactions', label: 'Transactions' },
{ id: 'support', label: 'Support' },
{ id: 'profile', label: 'Profile' }];


export function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const { orders, transactions, cart, loading, error } = useCustomerData(user?.id);
  const chat = useChat(user?.id ?? null, 'user');
  const [params, setParams] = useSearchParams();
  const tab = (tabs.find((t) => t.id === params.get('tab'))?.id ?? 'orders') as Tab;

  if (!authLoading && !user) return <Navigate to="/signin?redirect=/dashboard" replace />;

  const totalBalance = orders.reduce((s, o) => s + paymentState(o, transactions).balance, 0);
  const firstName = profile?.full_name?.split(' ')[0];

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-medium tracking-tight">{firstName ? `Hi, ${firstName}` : 'Dashboard'}</h1>
            <p className="mt-1 text-sm text-muted">
              {orders.length === 0 ?
              'You have no orders yet.' :
              totalBalance > 0 ?
              `Outstanding balance: ${formatPrice(totalBalance)}` :
              'All your vehicles are paid in full.'}
            </p>
          </div>
          {cart.length > 0 &&
          <Link to="/cart" className="flex items-center gap-2 rounded bg-panel px-4 py-2 text-sm font-medium hover:bg-line/60">
              <ShoppingCartIcon className="h-4 w-4" />
              Cart ({cart.length})
            </Link>
          }
        </div>

        <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-line" aria-label="Dashboard sections">
          {tabs.map((t) =>
          <button
            key={t.id}
            onClick={() => setParams({ tab: t.id })}
            aria-current={tab === t.id ? 'page' : undefined}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
            tab === t.id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`
            }>
            
              {t.label}
            </button>
          )}
        </nav>

        {error && <p role="alert" className="mt-6 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="mt-8">
          {loading || authLoading ?
          <div className="flex justify-center py-20 text-muted"><Loader2Icon className="h-6 w-6 animate-spin" /></div> :

          <>
              {tab === 'orders' && (
            orders.length === 0 ?
            <div className="flex flex-col items-center rounded-xl bg-panel px-6 py-16 text-center">
                    <p className="font-medium">No orders yet</p>
                    <p className="mt-1 text-sm text-muted">Configure your TACYE to get started.</p>
                    <ActionButton to="/vehicles/model-y" className="mt-6">Shop Vehicles</ActionButton>
                  </div> :

            <div className="space-y-4">
                    {orders.map((o) =>
              <OrderCard key={o.id} order={o} transactions={transactions} />
              )}
                  </div>)
            }

              {tab === 'transactions' && <TransactionTable transactions={transactions} orders={orders} />}

              {tab === 'support' &&
            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                  <ChatThread
                messages={chat.messages}
                viewer="user"
                loading={chat.loading}
                sending={chat.sending}
                error={chat.error}
                onSend={chat.send}
                emptyLabel="Send a message or upload a file and our support team will reply here." />
              
                  <aside className="text-sm text-muted">
                    <h2 className="text-base font-medium text-ink">Chat with Support</h2>
                    <p className="mt-2">Ask about your order, payments or delivery. You can attach screenshots, receipts or documents up to 10 MB.</p>
                  </aside>
                </div>
            }

              {tab === 'profile' &&
            <section className="max-w-3xl">
                  <ProfileDetails details={{ ...profile, email: profile?.email || user?.email }} />
                </section>
            }
            </>
          }
        </div>
      </main>
    </div>);

}