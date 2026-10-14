import React from 'react';
import { MIN_DEPOSIT } from '../../data/configurator';
import { PaymentPlan } from '../../types/order';
import { formatPrice } from '../../utils/currency';

type PaymentPlanSectionProps = {
  plan: PaymentPlan;
  onPlanChange: (plan: PaymentPlan) => void;
  payNow: string;
  onPayNowChange: (value: string) => void;
  total: number;
  balance: number;
  error: string;
};

const plans: {id: PaymentPlan;name: string;description: string;}[] = [
{ id: 'full', name: 'Pay Fully', description: 'Pay the full vehicle price today.' },
{ id: 'installment', name: 'Pay Little by Little', description: 'Pay a portion now and the rest over time from your dashboard.' }];


export function PaymentPlanSection({ plan, onPlanChange, payNow, onPayNowChange, total, balance, error }: PaymentPlanSectionProps) {
  return (
    <div className="mt-14">
      <h2 className="text-center text-2xl font-medium">Payment</h2>
      <div className="mt-5 space-y-3" role="radiogroup" aria-label="Payment option">
        {plans.map((p) => {
          const selected = plan === p.id;
          return (
            <button
              key={p.id}
              role="radio"
              aria-checked={selected}
              onClick={() => onPlanChange(p.id)}
              className={`w-full rounded-lg p-4 text-left ring-inset transition-shadow duration-150 ${selected ? 'ring-2 ring-ink' : 'ring-1 ring-line hover:ring-muted'}`}>
              
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-medium">{p.name}</span>
                {p.id === 'full' && <span className="text-sm font-medium">{formatPrice(total)}</span>}
              </div>
              <p className="mt-1 text-xs text-muted">{p.description}</p>
            </button>);

        })}
      </div>

      {plan === 'installment' &&
      <div className="mt-4 rounded-lg bg-panel p-4">
          <label htmlFor="pay-now" className="text-sm font-medium">
            Amount to pay now
          </label>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
            <input
            id="pay-now"
            type="number"
            inputMode="decimal"
            min={MIN_DEPOSIT}
            max={total}
            placeholder={String(MIN_DEPOSIT)}
            value={payNow}
            onChange={(e) => onPayNowChange(e.target.value)}
            className="h-10 w-full rounded bg-white pl-7 pr-3 text-sm outline-none ring-1 ring-line focus:ring-ink" />
          
          </div>
          {error ?
        <p className="mt-2 text-xs text-red-600">{error}</p> :

        <p className="mt-2 text-xs text-muted">Minimum {formatPrice(MIN_DEPOSIT)}.</p>
        }
          <div className="mt-4 flex justify-between border-t border-line pt-3 text-sm">
            <span className="text-muted">Remaining balance</span>
            <span className="font-medium">{formatPrice(balance)}</span>
          </div>
        </div>
      }
    </div>);

}