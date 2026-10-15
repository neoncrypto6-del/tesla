import { useState } from 'react';
import type { FinancingKey, PaymentSettings } from '../../types/payment';

type MethodKind = 'bank' | 'wire' | 'financing' | null;

function classifyMethod(name: string): MethodKind {
  const n = (name || '').toLowerCase();
  if (n.includes('bank') || n.includes('ach') || n.includes('deposit')) return 'bank';
  if (n.includes('wire')) return 'wire';
  if (n.includes('financ')) return 'financing';
  return null;
}

type Props = {
  method: string;
  settings: PaymentSettings | null;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-200 py-2 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900 break-all">
        {value || '—'}
      </span>
    </div>
  );
}

function CopyLine({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900 break-all">{value}</span>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="text-xs text-blue-600 hover:underline"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

function FiatDetails({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-gray-900">{title}</p>
      {value ? <CopyLine value={value} /> : <p className="text-sm text-gray-500">Not set</p>}
      {note && <p className="mt-2 text-xs text-gray-500">{note}</p>}
    </div>
  );
}

function CryptoDetails({
  title,
  address,
  network,
  qrUrl,
  note,
}: {
  title: string;
  address: string;
  network?: string;
  qrUrl?: string;
  note: string;
}) {
  if (!address) {
    return <p className="text-sm text-gray-500">{title} address not set.</p>;
  }

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-gray-900">
        {title}
        {network ? ` · ${network}` : ''}
      </p>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        {qrUrl ? (
          <img
            src={qrUrl}
            alt={`${title} QR code`}
            className="h-36 w-36 rounded-md border border-gray-200 bg-white object-contain p-1"
          />
        ) : (
          <div className="flex h-36 w-36 items-center justify-center rounded-md border border-dashed border-gray-300 p-2 text-center text-xs text-gray-400">
            QR code not uploaded yet
          </div>
        )}
        <div>
          <p className="mb-1 text-xs text-gray-500">Send only {title} to this address</p>
          <CopyLine value={address} />
        </div>
      </div>
      {note && <p className="mt-3 text-xs text-gray-500">{note}</p>}
    </div>
  );
}

export default function PaymentDetails({ method, settings }: Props) {
  const [financing, setFinancing] = useState<FinancingKey | null>(null);

  if (!settings) return null;

  const kind = classifyMethod(method);
  if (!kind) return null;

  if (kind === 'bank') {
    const d = settings.bank_transfer;
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-3 text-sm font-semibold text-gray-900">
          {d.instruction || 'Direct Deposit & ACH'}
        </p>
        <Row label="Account Number" value={d.account_number} />
        <Row label="Routing Number" value={d.routing_number} />
        <Row label="Bank Name" value={d.bank_name} />
        <Row label="Account Name" value={d.account_name} />
      </div>
    );
  }

  if (kind === 'wire') {
    const d = settings.wire_transfer;
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-3 text-sm font-semibold text-gray-900">Wire Transfer</p>
        <Row label="Account Number" value={d.account_number} />
        <Row label="Routing Number" value={d.routing_number} />
        <Row label="Bank Name" value={d.bank_name} />
        <Row label="Account Name" value={d.account_name} />
      </div>
    );
  }

  // Financing Partner
  const fp = settings.financing_partner;
  const options: { key: FinancingKey; label: string }[] = [
    { key: 'paypal', label: 'PayPal' },
    { key: 'zelle', label: 'Zelle' },
    { key: 'venmo', label: 'Venmo' },
    { key: 'cashapp', label: 'Cash App' },
    { key: 'usdt', label: 'USDT' },
    { key: 'btc', label: 'BTC' },
  ];
  const visible = options.filter((o) => fp[o.key]?.enabled);

  if (visible.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        No financing partners are configured yet.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {visible.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setFinancing(o.key)}
            className={`rounded-md border px-3 py-2 text-sm transition ${
              financing === o.key
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {financing && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          {financing === 'usdt' || financing === 'btc' ? (
            <CryptoDetails
              title={financing === 'usdt' ? 'USDT' : 'BTC'}
              address={fp[financing].address}
              network={'network' in fp[financing] ? (fp[financing] as any).network : undefined}
              qrUrl={fp[financing].qr_url}
              note={fp[financing].note}
            />
          ) : (
            <FiatDetails
              title={financing.charAt(0).toUpperCase() + financing.slice(1)}
              value={(fp[financing] as any).value}
              note={fp[financing].note}
            />
          )}
        </div>
      )}
    </div>
  );
}
