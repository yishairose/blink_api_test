"use server";

import { revalidatePath } from "next/cache";
import { PaymentData } from "../types";
import { redirect } from "next/dist/server/api-utils";

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
    customer_email,
    customer_name,
    payment_type,
  }: {
    transaction_type: string;
    amount: number;
    card_layout: string;
    delay_capture_days: number;
    customer_email?: string;
    customer_name?: string;
    payment_type?: string;
  }
) => {
  const reqBody = {
    customer_name,
    customer_email,
    transaction_type,
    payment_type: payment_type || "credit-card",
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
    return { success: true, ...data };
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return { success: false, error: error };
  }
};

export const makePaymentMOTO = async (data: PaymentData) => {
  const {
    accessToken,
    payment_intent,
    paymentToken,
    type,
    customer_email,
    customer_name,
    customer_address,
    customer_postcode,
    transaction_unique,
  } = data;

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
  console.log(body);

  try {
    const response = await fetch(`${URL}/creditcards`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Accept-Charset": "UTF-8",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return { success: true, ...data };
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return { success: false, error: error };
  }
};

export const makePaymentEcom = async (data: PaymentData) => {
  const {
    device_capabilities,
    device_accept_language,
    device_screen_resolution,
    device_timezone,
    remote_address,
    accessToken,
    payment_intent,
    paymentToken,
    type,
    customer_email,
    customer_name,
    transaction_unique,
  } = data;

  const body = {
    payment_intent,
    paymentToken,
    type,
    customer_email,
    customer_name,
    transaction_unique,
    device_capabilities,
    device_accept_language,
    device_screen_resolution,
    device_timezone,
    remote_address,
  };
  console.log(body);
  try {
    const response = await fetch(`${URL}/creditcards`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Accept-Charset": "UTF-8",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return { success: false, error: error };
  }
};

export const makePaymentGpay = async (data: PaymentData) => {
  console.log(data);
};

export const makeOBReq = async (data: {
  payment_intent: string;
  customerName: string;
  customerEmail: string;
  transaction_unique: string;
  accessToken: string;
}) => {
  const {
    payment_intent,
    customerName,
    customerEmail,
    transaction_unique,
    accessToken,
  } = data;
  try {
    const body = {
      payment_intent,
      customer_name: customerName,
      customer_email: customerEmail,
      transaction_unique,
    };

    const response = await fetch(`${URL}/openbankings`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Accept-Charset": "UTF-8",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    return { success: true, ...data };
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return { success: false, error: error };
  }
};

export const createPaymentLink = async (data: {
  payment_method: string;
  full_name: string;
  email: string;
  mobile_number: string;
  accessToken: string;
  amount: number;
}) => {
  const {
    payment_method,
    full_name,
    email,
    mobile_number,
    accessToken,
    amount,
  } = data;

  try {
    const body = {
      payment_method: [payment_method],
      transaction_type: "SALE",
      full_name,
      email,
      mobile_number,
      amount,
      currency: "GBP",
      redirect_url: "http://localhost:3000/success",
      reference: "test",
    };
    console.log(body);

    const response = await fetch(
      `https://secure.blinkpayment.co.uk/api/paylink/v1/paylinks`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return { success: true, ...data };
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return { success: false, error: error };
  }
};

export const setUpDirectDebit = async (data: {
  payment_intent: string;
  given_name: string;
  family_name: string;
  email: string;
  account_holder_name: string;
  account_number: string;
  branch_code: string;
  accessToken: string;
}) => {
  const {
    payment_intent,
    given_name,
    family_name,
    email,
    account_holder_name,
    account_number,
    branch_code,
    accessToken,
  } = data;
  try {
    const body = {
      payment_intent,
      given_name,
      family_name,
      email,
      account_holder_name,
      account_number,
      branch_code,
    };

    const response = await fetch(`${URL}/directdebits`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return { success: true, ...data };
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return { success: false, error: error };
  }
};

export const setUpRepeatPayments = async (data: {
  payment_intent: string;
  payment_token: string;
  accessToken: string;
  customer_name: string;
}) => {
  const { payment_intent, payment_token, accessToken, customer_name } = data;
  try {
    const body = {
      payment_intent,
      payment_type: "fixed_schedule",
      payment_token,
      type: 1,
      customer_name: customer_name,
      reference: "Test ref",
      currency: "GBP",
      frequency: "days",
      frequency_duration: 4,
      first_amount: 2.0,
      recurring_amount: 3.0,
    };

    const response = await fetch(`${URL}/repeat-payments`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return { success: true, ...data };
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return { success: false, error: error };
  }
};

export const cancelTransaction = async (
  transaction_id: string,
  accessToken: string
) => {
  try {
    const response = await fetch(
      `${URL}/transactions/${transaction_id}/cancels`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return { success: true, ...data };
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return { success: false, error: error };
  }
};
export const getTransaction = async (
  transaction_id: string,
  accessToken: string
) => {
  try {
    const response = await fetch(`${URL}/transactions/${transaction_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return { success: true, ...data };
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return { success: false, error: error };
  }
};
