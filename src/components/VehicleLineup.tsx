import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { lineup } from '../data/home';

export function VehicleLineup() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-6" aria-label="Vehicle lineup">
      <div className="relative">
        <div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:px-6">
          {lineup.map((v) =>
          <article
            key={v.slug}
            className="relative h-[520px] w-[88%] shrink-0 snap-start overflow-hidden rounded-xl md:w-[62%] lg:w-[48%]">
            
              <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
              <div className="relative flex h-full flex-col justify-end p-8 text-white">
                <h3 className="text-3xl font-medium tracking-tight md:text-4xl">{v.name}</h3>
                <p className="mt-1 text-base text-white/90">{v.tagline}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <ActionButton variant="primary" to={`/order/${v.slug}`} className="sm:min-w-[160px]">
                    Order Now
                  </ActionButton>
                  <ActionButton variant="white" to={`/vehicles/${v.slug}`} className="sm:min-w-[160px]">
                    Learn More
                  </ActionButton>
                </div>
              </div>
            </article>
          )}
        </div>
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous vehicles"
          className="absolute left-6 top-1/2 hidden -translate-y-1/2 rounded bg-white/80 p-2 text-ink backdrop-blur hover:bg-white md:block">
          
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Next vehicles"
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 rounded bg-white/80 p-2 text-ink backdrop-blur hover:bg-white md:block">
          
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </section>);

}