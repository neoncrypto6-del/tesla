export type BankTransferDetails = {
  instruction: string;
  account_number: string;
  routing_number: string;
  bank_name: string;
  account_name: string;
};

export type WireTransferDetails = {
  account_number: string;
  routing_number: string;
  bank_name: string;
  account_name: string;
};

export type FinancingMethod = {
  enabled: boolean;
  value: string;
  note: string;
};

export type CryptoMethod = {
  enabled: boolean;
  address: string;
  network?: string;
  qr_url: string; // NEW: uploaded QR image URL
  note: string;
};

export type FinancingPartnerDetails = {
  paypal: FinancingMethod;
  zelle: FinancingMethod;
  venmo: FinancingMethod;
  cashapp: FinancingMethod;
  usdt: CryptoMethod;
  btc: CryptoMethod;
};

export type PaymentSettings = {
  id: string;
  bank_transfer: BankTransferDetails;
  wire_transfer: WireTransferDetails;
  financing_partner: FinancingPartnerDetails;
  updated_at: string;
};

export type FinancingKey = keyof FinancingPartnerDetails;
