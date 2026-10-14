import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ActionButton } from '../components/ActionButton';
import { sections, SectionSlug } from '../data/sections';
import { useInquiry } from '../hooks/useInquiry';

type InfoPageProps = {slug: SectionSlug;};

export function InfoPage({ slug }: InfoPageProps) {
  const section = sections.find((s) => s.slug === slug) ?? sections[0];
  const requestInquiry = useInquiry();

  return (
    <div className="w-full bg-white">
      <Header transparent tone="light" />
      <main>
        <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
          <img src={section.image} alt={section.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
          <div className="relative flex h-full flex-col items-center justify-between px-6 pb-20 pt-[18vh] text-center text-white">
            <div>
              <h1 className="text-5xl font-medium tracking-tight md:text-6xl">{section.title}</h1>
              <p className="mt-2 text-base text-white/90">{section.subtitle}</p>
            </div>
            <div className="flex w-full max-w-[540px] flex-col gap-4 sm:flex-row sm:justify-center">
              <ActionButton variant="primary" onClick={() => requestInquiry(section.primaryLabel)}>
                {section.primaryLabel}
              </ActionButton>
              <ActionButton variant="white" to={section.secondary.to}>
                {section.secondary.label}
              </ActionButton>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1200px] gap-10 px-6 py-20 md:grid-cols-3">
          {section.features.map((f) =>
          <div key={f.title} className="border-t border-ink pt-5">
              <h2 className="text-xl font-medium text-ink">{f.title}</h2>
              <p className="mt-2 text-muted">{f.body}</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>);

}