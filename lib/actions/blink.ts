"use server";

import { revalidatePath } from "next/cache";

const URL = process.env.BLINK_API_URL;
const API_KEY = process.env.BLINK_API_KEY;
const SECRET = process.env.BLINK_API_SECRET;

export const generateToken = async () => {
  const reqBody: {
    api_key: string | undefined;
    secret_key: string | undefined;
    address_postcode_required: boolean;
    enable_moto_payments: boolean;
    application_name: string;
  } = {
    api_key: API_KEY,
    secret_key: SECRET,
    address_postcode_required: true,
    enable_moto_payments: true,
    application_name: "API test",
  };
  try {
    const response = await fetch(`${URL}/tokens`, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Token generation failed. Status: " + response.status);
    }
    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const createIntent = async (
  accessToken: string,
  {
    transaction_type,
    amount,
    card_layout,
    delay_capture_days,
  }: {
    transaction_type: string;
    amount: number;
    card_layout: string;
    delay_capture_days: number;
  }
) => {
  const reqBody = {
    transaction_type,
    payment_type: "credit-card",
    amount,
    currency: "GBP",
    card_layout,
    delay_capture_days,
    return_url: "http://localhost:3000/success",
    notification_url: "http://localhost:3000/notification",
  };
  try {
    const response = await fetch(`${URL}/intents`, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return error;
  }
};

export const makePaymentMOTO = async (data: FormData) => {
  const access_token = data.get("access_token");
  const payment_intent = data.get("payment_intent");
  const paymentToken = data.get("paymentToken");
  const type = data.get("type");
  const customer_email = data.get("customer_email");
  const customer_name = data.get("customer_name");
  const customer_address = data.get("customer_address");
  const customer_postcode = data.get("customer_postcode");
  const transaction_unique = data.get("transaction_unique");

  const body = {
    payment_intent,
    paymentToken,
    type,
    customer_email,
    customer_name,
    customer_address,
    customer_postcode,
    transaction_unique,
  };

  try {
    const response = await fetch(`${URL}/creditcards`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return error;
  }
};

export const makePaymentEcom = async (data: FormData) => {
  console.log(data);
};
export const makePaymentGpay = async (data: FormData) => {
  console.log(data);
};
