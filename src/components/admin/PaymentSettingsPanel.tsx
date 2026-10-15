import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { usePaymentSettings } from '../../hooks/usePaymentSettings';
import type { FinancingKey, PaymentSettings } from '../../types/payment';

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </label>
  );
}

export function PaymentSettingsPanel() {
  const { settings, loading, reload } = usePaymentSettings();
  const [draft, setDraft] = useState<PaymentSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);

  if (loading || !draft)
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;

  const set = (path: string, value: string | boolean) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev) as any;
      const parts = path.split('.');
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  };

  async function save() {
    if (!draft) return;
    setSaving(true);
    setMsg(null);
    const { error } = await supabase
      .from('payment_settings')
      .update({
        bank_transfer: draft.bank_transfer,
        wire_transfer: draft.wire_transfer,
        financing_partner: draft.financing_partner,
      })
      .eq('id', 'default');
    setSaving(false);
    if (error) setMsg('Save failed: ' + error.message);
    else {
      setMsg('Saved');
      reload();
    }
  }

  const fp = draft.financing_partner;

  const financingRows: { key: FinancingKey; label: string; isCrypto: boolean }[] = [
    { key: 'paypal', label: 'PayPal', isCrypto: false },
    { key: 'zelle', label: 'Zelle', isCrypto: false },
    { key: 'venmo', label: 'Venmo', isCrypto: false },
    { key: 'cashapp', label: 'Cash App', isCrypto: false },
    { key: 'usdt', label: 'USDT', isCrypto: true },
    { key: 'btc', label: 'BTC', isCrypto: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Payment details</h2>
        <p className="text-sm text-gray-500">
          These appear to customers on the payment page under the matching method.
        </p>
      </div>

      {/* Bank Transfer */}
      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Bank Transfer</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Instruction line"
            value={draft.bank_transfer.instruction}
            onChange={(v) => set('bank_transfer.instruction', v)}
            placeholder="Direct Deposit & ACH"
          />
          <Field
            label="Account Name"
            value={draft.bank_transfer.account_name}
            onChange={(v) => set('bank_transfer.account_name', v)}
          />
          <Field
            label="Bank Name"
            value={draft.bank_transfer.bank_name}
            onChange={(v) => set('bank_transfer.bank_name', v)}
          />
          <Field
            label="Account Number"
            value={draft.bank_transfer.account_number}
            onChange={(v) => set('bank_transfer.account_number', v)}
          />
          <Field
            label="Routing Number"
            value={draft.bank_transfer.routing_number}
            onChange={(v) => set('bank_transfer.routing_number', v)}
          />
        </div>
      </section>

      {/* Wire Transfer */}
      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Wire Transfer</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Account Name"
            value={draft.wire_transfer.account_name}
            onChange={(v) => set('wire_transfer.account_name', v)}
          />
          <Field
            label="Bank Name"
            value={draft.wire_transfer.bank_name}
            onChange={(v) => set('wire_transfer.bank_name', v)}
          />
          <Field
            label="Account Number"
            value={draft.wire_transfer.account_number}
            onChange={(v) => set('wire_transfer.account_number', v)}
          />
          <Field
            label="Routing Number"
            value={draft.wire_transfer.routing_number}
            onChange={(v) => set('wire_transfer.routing_number', v)}
          />
        </div>
      </section>

      {/* Financing Partner */}
      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Financing Partner options
        </h3>
        <p className="mb-4 text-xs text-gray-500">
          Enable only the ones you want customers to see.
        </p>
        <div className="space-y-4">
          {financingRows.map(({ key, label, isCrypto }) => {
            const cfg = fp[key] as any;
            return (
              <div key={key} className="rounded-md border border-gray-200 p-3">
                <label className="mb-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!cfg.enabled}
                    onChange={(e) => set(`financing_partner.${key}.enabled`, e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </label>
                {cfg.enabled && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {isCrypto ? (
                      <>
                        <Field
                          label="Wallet address"
                          value={cfg.address || ''}
                          onChange={(v) => set(`financing_partner.${key}.address`, v)}
                        />
                        {key === 'usdt' && (
                          <Field
                            label="Network (e.g. TRC20, ERC20)"
                            value={cfg.network || ''}
                            onChange={(v) => set(`financing_partner.${key}.network`, v)}
                          />
                        )}
                      </>
                    ) : (
                      <Field
                        label={`${label} handle / email / phone`}
                        value={cfg.value || ''}
                        onChange={(v) => set(`financing_partner.${key}.value`, v)}
                      />
                    )}
                    <Field
                      label="Note (optional)"
                      value={cfg.note || ''}
                      onChange={(v) => set(`financing_partner.${key}.note`, v)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save payment details'}
        </button>
        {msg && <span className="text-sm text-gray-600">{msg}</span>}
      </div>
    </div>
  );
}

export default PaymentSettingsPanel;
