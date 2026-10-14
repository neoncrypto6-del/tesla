import React from 'react';
import { ActionButton } from './ActionButton';
import { energyCards } from '../data/home';
import { images } from '../data/images';
import { useInquiry } from '../hooks/useInquiry';

export function EnergySection() {
  const requestInquiry = useInquiry();

  return (
    <section className="bg-white px-4 py-6 md:px-6" aria-label="Energy and charging">
      <div className="grid gap-4 md:grid-cols-2">
        {energyCards.map((card) =>
        <article key={card.id} className="relative h-[460px] overflow-hidden rounded-xl">
            <img src={card.image} alt={card.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-end p-8 text-white">
              <h3 className="text-3xl font-medium tracking-tight">{card.title}</h3>
              <p className="mt-1 text-white/90">{card.subtitle}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ActionButton variant="primary" onClick={() => requestInquiry(card.title)} className="sm:min-w-[160px]">
                  Order Now
                </ActionButton>
                <ActionButton variant="white" to={card.learn} className="sm:min-w-[160px]">
                  Learn More
                </ActionButton>
              </div>
            </div>
          </article>
        )}
      </div>

      <article className="relative mt-4 h-[420px] overflow-hidden rounded-xl">
        <img src={images.supercharger} alt="Supercharger station at night" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-end p-8 text-white md:p-12">
          <h3 className="text-3xl font-medium tracking-tight md:text-4xl">Find Your Charge</h3>
          <p className="mt-1 max-w-md text-white/90">View the network of Superchargers and Destination Chargers near you.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ActionButton variant="white" to="/charging" className="sm:min-w-[160px]">
              View Network
            </ActionButton>
            <ActionButton variant="secondary" to="/charging" className="sm:min-w-[160px]">
              Learn More
            </ActionButton>
          </div>
        </div>
      </article>
    </section>);

}