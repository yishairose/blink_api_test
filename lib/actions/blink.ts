"use server";

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
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    if (error instanceof Error) return error?.message;
    return error;
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

export const makePaymentMOTO = async (accessToken: string, data) => {
  console.log(data);
  //   const reqBody = {
  //     accessToken,
  //     payment_intent,
  //     paymentToken,
  //     type,
  //     customer_email,
  //     customer_name,
  //     transaction_unique,
  //   };

  //   try {
  //     const response = await fetch(`${URL}/creditcards`, {
  //       method: "POST",
  //       body: JSON.stringify(reqBody),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //     return data;
  //   } catch (error) {
  //     if (error instanceof Error) return error?.message;
  //     return error;
  //   }
};
