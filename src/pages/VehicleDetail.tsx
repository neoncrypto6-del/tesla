import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ActionButton } from '../components/ActionButton';
import { PriceTag } from '../components/PriceTag';
import { vehicles } from '../data/vehicles';
import { images } from '../data/images';

const gridCols: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

export function VehicleDetail() {
  const { slug } = useParams();
  const vehicle = vehicles.find((v) => v.slug === slug);

  if (!vehicle) {
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

  // --- THEME LOGIC ---
  const isDark = vehicle.theme === 'dark';
  const bgClass = isDark ? 'bg-black' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-ink';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-muted';
  const panelClass = isDark ? 'bg-zinc-900' : 'bg-panel';
  const borderClass = isDark ? 'border-zinc-800' : 'border-line';
  // -------------------

  const best = vehicle.trims.reduce(
    (acc, t) => ({
      range: Math.max(acc.range, parseInt(t.range)),
      accel: Math.min(acc.accel, parseFloat(t.zeroToSixty)),
      speed: Math.max(acc.speed, parseInt(t.topSpeed)),
    }),
    { range: 0, accel: 99, speed: 0 }
  );
  const others = vehicles.filter((v) => v.slug !== vehicle.slug);

  return (
    <div className={`w-full transition-colors duration-300 ${bgClass} ${textClass}`}>
      <Header transparent tone="light" />
      <main>
        <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
          <div className="relative flex h-full flex-col items-center justify-between px-6 pb-16 pt-[18vh] text-center text-white">
            <div>
              <h1 className="text-5xl font-medium tracking-tight md:text-6xl">{vehicle.name}</h1>
              <p className="mt-2 text-base text-white/90">{vehicle.tagline}</p>
            </div>
            <div className="w-full max-w-3xl">
              <dl className="grid grid-cols-3 gap-4">
                <div>
                  <dd className="text-2xl font-medium md:text-3xl">{best.range} mi</dd>
                  <dt className="text-xs text-white/80 md:text-sm">Range (EPA est.)</dt>
                </div>
                <div>
                  <dd className="text-2xl font-medium md:text-3xl">{best.accel} s</dd>
                  <dt className="text-xs text-white/80 md:text-sm">0-60 mph</dt>
                </div>
                <div>
                  <dd className="text-2xl font-medium md:text-3xl">{best.speed} mph</dd>
                  <dt className="text-xs text-white/80 md:text-sm">Top Speed</dt>
                </div>
              </dl>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ActionButton to={`/order/${vehicle.slug}`} variant="primary">
                  Order Now
                </ActionButton>
                <ActionButton
                  variant="white"
                  onClick={() =>
                    document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Compare Models
                </ActionButton>
              </div>
            </div>
          </div>
        </section>

        <section id="models" className="mx-auto max-w-[1280px] px-6 py-20">
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
            Choose Your {vehicle.name}
          </h2>
          <p className={`mt-2 max-w-xl ${textMutedClass}`}>{vehicle.description}</p>
          <div
            className={`mt-10 grid gap-4 md:grid-cols-2 ${
              gridCols[vehicle.trims.length] ?? 'lg:grid-cols-3'
            }`}
          >
            {vehicle.trims.map((t) => (
              <article key={t.id} className={`flex flex-col rounded-xl p-6 ${panelClass}`}>
                <p className={`text-xs ${textMutedClass}`}>{t.drive}</p>
                <h3 className={`mt-1 min-h-[3rem] text-lg font-medium leading-snug ${textClass}`}>
                  {t.name}
                </h3>
                <div className="mt-4">
                  <PriceTag original={t.price} size="lg" isDark={isDark} />
                </div>
                <p className={`text-xs ${textMutedClass}`}>Purchase price before incentives</p>
                <dl className={`mt-6 grid grid-cols-3 gap-2 border-t pt-5 ${borderClass}`}>
                  <div>
                    <dd className="text-base font-medium">{t.range}</dd>
                    <dt className={`text-xs ${textMutedClass}`}>Range</dt>
                  </div>
                  <div>
                    <dd className="text-base font-medium">{t.zeroToSixty}</dd>
                    <dt className={`text-xs ${textMutedClass}`}>0-60 mph</dt>
                  </div>
                  <div>
                    <dd className="text-base font-medium">{t.topSpeed}</dd>
                    <dt className={`text-xs ${textMutedClass}`}>Top Speed</dt>
                  </div>
                </dl>
                <div className="mt-auto pt-6">
                  <ActionButton
                    to={`/order/${vehicle.slug}?trim=${t.id}`}
                    variant="primary"
                    fullWidth
                  >
                    Order Now
                  </ActionButton>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={`grid items-center gap-10 px-6 py-16 lg:grid-cols-[1.4fr_1fr] lg:px-16 ${panelClass}`}>
          <img
            src={isDark ? images.roadsterInterior : images.interiorWhite}
            alt={`${vehicle.name} interior`}
            className="w-full rounded-xl object-cover"
          />
          <div>
            <h2 className="text-3xl font-medium tracking-tight">Interior of the Future</h2>
            <p className={`mt-3 ${textMutedClass}`}>
              A minimalist cabin with a panoramic glass roof, heated and ventilated seats and a
              responsive touchscreen. Choose All Black or Black and White when you order.
            </p>
            <ActionButton to={`/order/${vehicle.slug}`} variant={isDark ? 'white' : 'dark'} className="mt-8">
              Customize Yours
            </ActionButton>
          </div>
        </section>

        <section className="px-6 py-16">
          <h2 className="text-2xl font-medium tracking-tight">Explore Other Models</h2>
          <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto">
            {others.map((v) => (
              <Link key={v.slug} to={`/vehicles/${v.slug}`} className="group w-64 shrink-0">
                <img
                  src={v.image}
                  alt={v.name}
                  className="h-36 w-full rounded-lg object-cover"
                />
                <p className={`mt-3 font-medium ${textClass}`}>{v.name}</p>
                <div className={`text-sm ${textMutedClass} group-hover:${textClass}`}>
                  From <PriceTag original={v.trims[0].price} size="sm" isDark={isDark} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
