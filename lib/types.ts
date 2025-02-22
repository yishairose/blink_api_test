interface Element {
  ccMotoElement: string;
  ccElement: string;
  ddElement: string;
  obElement: string;
  gpElement: string;
  apElement: string;
}

export interface PaymentIntentResponse {
  success: boolean;
  id: number;
  payment_intent: string;
  transaction_type: string;
  expiry_date: string;
  amount: number;
  currency: string;
  payment_type: string;
  return_url: string;
  notification_url: string;
  card_layout: string;
  element: Element;
  merchant_id: number;
  transaction_unique: string;
}

export type PaymentData = {
  device_timezone: string;
  device_capabilities: string;
  device_accept_language: string;
  device_screen_resolution: string;
  remote_address: string;
  accessToken: string;
  payment_intent: string;
  paymentToken: string;
  type: string;
  customer_email: string;
  customer_name: string;
  customer_address: string;
  customer_postcode: string;
  transaction_unique: string;
};

export interface PayLink {
  id: string;
  paylink_url: string;
  status: string;
  created_by: string;
  amount: number;
}
