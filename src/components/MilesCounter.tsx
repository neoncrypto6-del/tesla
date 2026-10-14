import React, { useEffect, useState } from 'react';

const BASE_MILES = 15531260852;
const MILES_PER_SECOND = 23;

export function MilesCounter() {
  const [miles, setMiles] = useState(BASE_MILES);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      setMiles(BASE_MILES + Math.floor((now - start) / 1000 * MILES_PER_SECOND));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <span className="tabular-nums" aria-live="off">
      {miles.toLocaleString('en-US')}
    </span>);

}