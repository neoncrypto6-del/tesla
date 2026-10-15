import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { Header } from '../components/Header';
import { ActionButton } from '../components/ActionButton';
import { PriceTag } from '../components/PriceTag';
import { ChargingSection } from '../components/order/ChargingSection';
import { PaymentPlanSection } from '../components/order/PaymentPlanSection';
import { vehicles } from '../data/vehicles';
import { fsdOption, interiorOptions, paintOptions } from '../data/configurator';
import { useOrder } from '../hooks/useOrder';
import { formatAddOn, formatPrice } from '../utils/currency';

export function Order() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const vehicle = vehicles.find((v) => v.slug === slug);
  const order = useOrder(vehicle, params.get('trim'));

  if (!vehicle || !order.trim) {
    return (
      <div className="min-h-screen w-full bg-white">
        <Header />
        <main className="flex flex-col items-center px-6 pt-40 text-center">
          <h1 className="text-3xl font-medium">Vehicle not found</h1>
          <ActionButton to="/" className="mt-6">
            Back to Home
          </ActionButton>
        </main>
      </div>
    );
  }

  const previewImage = order.view === 'interior' ? order.interior.image : vehicle.image;

  return (
    <div className="w-full bg-white">
      <Header />
      <main className="pt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_440px]">
        <section
          className="relative bg-panel lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)]"
          aria-label="Vehicle preview"
        >
          <div className="relative h-[45vh] w-full overflow-hidden lg:h-full">
            <AnimatePresence initial={false}>
              <motion.img
                key={previewImage}
                src={previewImage}
                alt={
                  order.view === 'interior'
                    ? `${order.interior.name} interior`
                    : `${vehicle.name} in ${order.paint.name}`
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 rounded-full bg-white/85 p-1 text-sm backdrop-blur">
              {(['exterior', 'interior'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => order.setView(v)}
                  className={`rounded-full px-4 py-1.5 font-medium capitalize transition-colors duration-150 ${
                    order.view === v ? 'bg-ink text-white' : 'text-ink hover:bg-black/5'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            {order.view === 'exterior' && (
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium backdrop-blur">
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: order.paint.hex }}
                />
                {order.paint.name}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 pb-48 pt-10 lg:px-10" aria-label="Configure your vehicle">
          <h1 className="text-center text-4xl font-medium tracking-tight">{vehicle.name}</h1>
          <p className="mt-1 text-center text-sm text-muted">Est. delivery: 4–6 weeks</p>

          <div className="mt-8 space-y-3" role="radiogroup" aria-label="Model">
            {vehicle.trims.map((t) => {
              const selected = t.id === order.trim?.id;
              return (
                <button
                  key={t.id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => order.setTrimId(t.id)}
                  className={`w-full rounded-lg p-4 text-left ring-inset transition-shadow duration-150 ${
                    selected ? 'ring-2 ring-ink' : 'ring-1 ring-line hover:ring-muted'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm font-medium">{t.name}</span>
                    <PriceTag original={t.price} size="sm" />
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-muted">
                    <span>{t.range}</span>
                    <span>{t.zeroToSixty} 0-60</span>
                    <span>{t.topSpeed}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <h2 className="text-2xl font-medium">Paint</h2>
            <div
              className="mt-5 flex flex-wrap justify-center gap-3"
              role="radiogroup"
              aria-label="Exterior paint"
            >
              {paintOptions.map((p) => {
                const selected = p.id === order.paint.id;
                return (
                  <button
                    key={p.id}
                    role="radio"
                    aria-checked={selected}
                    aria-label={p.name}
                    title={p.name}
                    onClick={() => order.selectPaint(p.id)}
                    className={`h-11 w-11 rounded-full p-[3px] transition-shadow duration-150 ${
                      selected ? 'ring-2 ring-brand' : 'ring-1 ring-transparent hover:ring-line'
                    }`}
                  >
                    <span
                      className="block h-full w-full rounded-full ring-1 ring-inset ring-black/10"
                      style={{ backgroundColor: p.hex }}
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm font-medium">{order.paint.name}</p>
            <p className="text-xs text-muted">{formatAddOn(order.paint.price)}</p>
          </div>

          <div className="mt-14 text-center">
            <h2 className="text-2xl font-medium">Interior</h2>
            <div className="mt-5 flex justify-center gap-3" role="radiogroup" aria-label="Interior">
              {interiorOptions.map((i) => {
                const selected = i.id === order.interior.id;
                return (
                  <button
                    key={i.id}
                    role="radio"
                    aria-checked={selected}
                    aria-label={i.name}
                    onClick={() => order.selectInterior(i.id)}
                    className={`h-11 w-11 rounded-full p-[3px] transition-shadow duration-150 ${
                      selected ? 'ring-2 ring-brand' : 'ring-1 ring-transparent hover:ring-line'
                    }`}
                  >
                    <span className="flex h-full w-full overflow-hidden rounded-full ring-1 ring-inset ring-black/10">
                      <span
                        className="h-full w-1/2"
                        style={{ backgroundColor: i.swatch[0] }}
                      />
                      <span
                        className="h-full w-1/2"
                        style={{ backgroundColor: i.swatch[1] }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm font-medium">{order.interior.name}</p>
            <p className="text-xs text-muted">{formatAddOn(order.interior.price)}</p>
          </div>

          <div className="mt-14">
            <h2 className="text-center text-2xl font-medium">Full Self-Driving (Supervised)</h2>
            <div className="mt-5 rounded-lg p-5 ring-1 ring-line">
              <p className="text-sm text-ink">{fsdOption.description}</p>
              <ul className="mt-4 space-y-2">
                {fsdOption.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                    {f}
                  </li>
                ))}
              </ul>
              <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 border-t border-panel pt-4">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={order.fsd}
                    onChange={(e) => order.setFsd(e.target.checked)}
                    className="h-5 w-5 rounded border-line accent-brand"
                  />
                  <span className="text-sm font-medium">Add Full Self-Driving</span>
                </span>
                <span className="text-sm font-medium">{formatPrice(fsdOption.price)}</span>
              </label>
            </div>
          </div>

          <ChargingSection />

          <PaymentPlanSection
            plan={order.plan}
            onPlanChange={order.setPlan}
            payNow={order.payNow}
            onPayNowChange={order.setPayNow}
            total={order.total}
            balance={order.balance}
            error={order.payNowError}
          />
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-panel bg-white/95 backdrop-blur lg:left-auto lg:w-[440px]">
        <div className="px-6 py-4 lg:px-10">
          {order.status === 'error' && (
            <p role="alert" className="mb-3 rounded bg-red-50 px-3 py-2 text-xs text-red-700">
              {order.error}
            </p>
          )}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">Vehicle total</span>
            <span className="text-sm font-medium">{formatPrice(order.total)}</span>
          </div>
          <div className="mb-3 mt-1 flex items-baseline justify-between">
            <span className="text-sm text-muted">
              {order.plan === 'full' ? 'Due today (paid fully)' : 'Paying now'}
            </span>
            <span className="text-xl font-medium">{formatPrice(order.dueToday)}</span>
          </div>
          <ActionButton
            variant="primary"
            fullWidth
            onClick={order.submit}
            disabled={order.status === 'submitting'}
          >
            {order.status === 'submitting' ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : order.user ? (
              'Proceed to Payment'
            ) : (
              'Order Now'
            )}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
