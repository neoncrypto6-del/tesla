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
  const [uploading, setUploading] = useState<'usdt' | 'btc' | null>(null);
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

  async function handleQrUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    key: 'usdt' | 'btc'
  ) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMsg('Please choose an image file (PNG, JPG, SVG).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMsg('Image is too large. Maximum 2 MB.');
      return;
    }

    setUploading(key);
    setMsg(null);
    try {
      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const path = `${key}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('payment-qr')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('payment-qr').getPublicUrl(path);
      set(`financing_partner.${key}.qr_url`, data.publicUrl);
      setMsg('QR image uploaded. Click Save to publish it.');
    } catch (err: any) {
      setMsg('Upload failed: ' + (err.message || 'unknown error'));
    } finally {
      setUploading(null);
    }
  }

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
            const cryptoKey = key as 'usdt' | 'btc';
            return (
              <div key={key} className="rounded-md border border-gray-200 p-3">
                <label className="mb-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!cfg.enabled}
                    onChange={(e) =>
                      set(`financing_partner.${key}.enabled`, e.target.checked)
                    }
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

                        {/* QR image upload */}
                        <div className="sm:col-span-2">
                          <span className="mb-1 block text-xs font-medium text-gray-600">
                            QR code image
                          </span>
                          <div className="flex items-center gap-4">
                            {cfg.qr_url ? (
                              <img
                                src={cfg.qr_url}
                                alt={`${label} QR`}
                                className="h-20 w-20 rounded border border-gray-200 bg-white object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-20 w-20 items-center justify-center rounded border border-dashed border-gray-300 text-center text-[10px] text-gray-400">
                                No image
                              </div>
                            )}
                            <div className="flex flex-col gap-2">
                              <label className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                {uploading === cryptoKey
                                  ? 'Uploading…'
                                  : cfg.qr_url
                                  ? 'Replace image'
                                  : 'Upload image'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploading !== null}
                                  onChange={(e) => handleQrUpload(e, cryptoKey)}
                                />
                              </label>
                              {cfg.qr_url && (
                                <button
                                  type="button"
                                  onClick={() => set(`financing_partner.${key}.qr_url`, '')}
                                  className="text-left text-xs text-red-600 hover:underline"
                                >
                                  Remove image
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG or SVG. Max 2 MB. Shown to customers when they select {label}.
                          </p>
                        </div>
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
          disabled={saving || uploading !== null}
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
