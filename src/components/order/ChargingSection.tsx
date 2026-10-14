import React from 'react';
import { CheckIcon, ZapIcon } from 'lucide-react';
import { chargingIncluded } from '../../data/configurator';

export function ChargingSection() {
  return (
    <div className="mt-14">
      <h2 className="text-center text-2xl font-medium">Charging</h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm text-muted">
        Every Tacye includes access to the largest global Supercharging network and a Wall Connector.
      </p>
      <ul className="mt-5 divide-y divide-panel rounded-lg ring-1 ring-line">
        {chargingIncluded.map((c) =>
        <li key={c.id} className="flex items-start gap-3 p-4">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panel">
              {c.id === 'supercharging' ? <ZapIcon className="h-3.5 w-3.5" /> : <CheckIcon className="h-3.5 w-3.5" />}
            </span>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-medium">{c.name}</span>
                <span className="text-sm text-muted">Included</span>
              </div>
              <p className="mt-1 text-xs text-muted">{c.description}</p>
            </div>
          </li>
        )}
      </ul>
    </div>);

}