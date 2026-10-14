import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionButton } from './ActionButton';
import { MilesCounter } from './MilesCounter';
import { fsdCaptions, fsdImages } from '../data/home';
import { useInquiry } from '../hooks/useInquiry';

export function FsdSection() {
  const [caption, setCaption] = useState(0);
  const requestInquiry = useInquiry();

  useEffect(() => {
    const t = setInterval(() => setCaption((c) => (c + 1) % fsdCaptions.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-white px-4 py-6 md:px-6" aria-labelledby="fsd-heading">
      <div className="grid gap-10 rounded-xl bg-panel px-6 py-10 md:px-12 md:py-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="flex flex-col">
          <h2 id="fsd-heading" className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-[52px]">
            Full <span className="text-brand">Self-Driving (Supervised)</span>
          </h2>
          <p className="mt-3 text-base text-muted md:text-lg">
            Makes every drive easier. Subscribe for $99/mo.<sup className="text-[10px]">1</sup>
          </p>

          <dl className="mt-12 flex flex-wrap gap-x-16 gap-y-8">
            <div>
              <dd className="text-4xl font-medium tracking-tight text-ink md:text-5xl">7x</dd>
              <dt className="mt-2 text-base text-muted md:text-lg">Fewer Collisions</dt>
            </div>
            <div>
              <dd className="text-4xl font-medium tracking-tight text-ink md:text-5xl">
                <MilesCounter />
              </dd>
              <dt className="mt-2 text-base text-muted md:text-lg">Miles Driven</dt>
            </div>
          </dl>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:pt-12">
            <ActionButton variant="dark" onClick={() => requestInquiry('Full Self-Driving Demo')} className="sm:min-w-[220px]">
              Schedule Demo
            </ActionButton>
            <ActionButton variant="white" to="/order/model-y" className="sm:min-w-[220px]">
              Learn More
            </ActionButton>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-[1.7fr_2fr_1fr] gap-4 md:gap-6">
            {fsdImages.top.map((img) =>
            <img key={img.src} src={img.src} alt={img.alt} className="h-28 w-full rounded-xl object-cover sm:h-36 md:h-44" />
            )}
          </div>
          <div className="mt-4 grid grid-cols-[1.1fr_1fr] gap-4 md:mt-6 md:gap-6">
            {fsdImages.bottom.map((img) =>
            <img key={img.src} src={img.src} alt={img.alt} className="h-40 w-full rounded-xl object-cover sm:h-52 md:h-64" />
            )}
          </div>
          <div className="relative mt-6 h-7 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={caption}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="text-lg font-medium text-ink">
                
                {fsdCaptions[caption]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>);

}