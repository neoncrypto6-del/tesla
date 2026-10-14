export type PaymentPlan = 'full' | 'installment';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type OrderConfig = {
  vehicle_slug: string;
  vehicle_name: string;
  trim_name: string;
  exterior_color: string;
  interior: string;
  full_self_driving: boolean;
  charging_option: string;
  total_price: number;
  payment_plan: PaymentPlan;
  initial_amount: number;
};

export type CartItem = OrderConfig & {
  id: string;
  user_id: string;
  created_at: string;
};

export type OrderRecord = OrderConfig & {
  id: string;
  user_id: string;
  customer_name: string | null;
  customer_email: string | null;
  status: string;
  created_at: string;
};

export type Transaction = {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  method: string;
  reference: string | null;
  status: TransactionStatus;
  created_at: string;
  updated_at: string | null;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  sender: 'user' | 'admin';
  body: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  created_at: string;
};

export type Customer = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  delivery_address: string | null;
  state: string | null;
  zipcode: string | null;
  created_at: string;
};