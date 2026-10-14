import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { heroSlides, HeroTone } from '../data/home';

type HeroCarouselProps = {onToneChange: (tone: HeroTone) => void;};

export function HeroCarousel({ onToneChange }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = heroSlides[index];
  const count = heroSlides.length;

  useEffect(() => {
    onToneChange(slide.tone);
  }, [slide.tone, onToneChange]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), 7000);
    return () => clearTimeout(t);
  }, [index, paused, count]);

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);
  const light = slide.tone === 'light';

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink" aria-roledescription="carousel" aria-label="Featured vehicles">
      <AnimatePresence initial={false}>
        <motion.img
          key={slide.id}
          src={slide.image}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover" />
        
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pb-24 pt-[18vh] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={light ? 'text-white' : 'text-ink'}>
            
            <h1 className="text-[40px] font-medium leading-tight tracking-tight md:text-5xl">{slide.title}</h1>
            <p className={`mt-2 text-sm md:text-base ${light ? 'text-white/90' : 'text-ink/80'}`}>{slide.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex w-full max-w-[540px] flex-col gap-4 sm:flex-row sm:justify-center">
          <ActionButton to={slide.primary.to} variant="primary">
            {slide.primary.label}
          </ActionButton>
          <ActionButton to={slide.secondary.to} variant="secondary">
            {slide.secondary.label}
          </ActionButton>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex items-center justify-center gap-3">
        <button onClick={() => go(-1)} aria-label="Previous slide" className="rounded-full bg-white/70 p-1 text-ink backdrop-blur hover:bg-white">
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 backdrop-blur">
          {heroSlides.map((s, i) =>
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to ${s.title}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-[width,background-color] duration-200 ease-out ${i === index ? 'w-6 bg-ink' : 'w-2 bg-ink/30'}`} />

          )}
        </div>
        <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play carousel' : 'Pause carousel'} className="rounded-full bg-white/70 p-1.5 text-ink backdrop-blur hover:bg-white">
          {paused ? <PlayIcon className="h-3 w-3" /> : <PauseIcon className="h-3 w-3" />}
        </button>
        <button onClick={() => go(1)} aria-label="Next slide" className="rounded-full bg-white/70 p-1 text-ink backdrop-blur hover:bg-white">
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </section>);

}