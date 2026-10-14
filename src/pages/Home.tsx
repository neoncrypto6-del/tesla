import React, { useCallback, useState } from 'react';
import { Header } from '../components/Header';
import { HeroCarousel } from '../components/HeroCarousel';
import { FsdSection } from '../components/FsdSection';
import { VehicleLineup } from '../components/VehicleLineup';
import { EnergySection } from '../components/EnergySection';
import { Footer } from '../components/Footer';
import { HeroTone } from '../data/home';

export function Home() {
  const [tone, setTone] = useState<HeroTone>('dark');
  const handleTone = useCallback((t: HeroTone) => setTone(t), []);

  return (
    <div className="w-full bg-white">
      <Header transparent tone={tone} />
      <main>
        <HeroCarousel onToneChange={handleTone} />
        <FsdSection />
        <VehicleLineup />
        <EnergySection />
      </main>
      <Footer />
    </div>);

}