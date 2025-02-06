import { Button } from "@/components/ui/button";
import { makePaymentMOTO } from "@/lib/actions/blink";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export async function hostedFieldsSetup(selector: string) {
  const form: HTMLFormElement | null = document.querySelector(selector);

  if (!form) return;

  try {
    $("input[type='hostedfield:cardNumber']").hostedField({
      nativeEvents: true,
    });
    $("input[type='hostedfield:cardExpiryDate']").hostedField({
      nativeEvents: true,
    });
    $("input[type='hostedfield:cardCvv']").hostedField({
      nativeEvents: true,
    });
  } catch (error) {
    console.log("failed to create fields", error);
  }
}

function PaymentForm({ html, accessToken }) {
  const router = useRouter();
  useEffect(() => {
    hostedFieldsSetup("#payment");
  }, []);
  type PaymentData = {
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
  async function handleSubmit(e) {
    e.preventDefault();
    const form: HTMLFormElement | null = document.querySelector("#payment");
    if (!form) return;
    const hostedForm: any = $(form).hostedForm("instance");
    try {
      const response = await hostedForm.getPaymentDetails();
      const paymentToken = response.paymentToken;
      const formData = new FormData(form);
      const data = {
        paymentToken,
        ...Object.fromEntries(formData.entries()),
      };

      const returnUrl = await makePaymentMOTO(data as PaymentData);
      router.replace(returnUrl.url);
    } catch (error) {}
  }

  return (
    <form id="payment" method="POST" onSubmit={handleSubmit}>
      <input type="hidden" name="accessToken" value={accessToken} />

      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />

      <Button type="submit">Pay</Button>
    </form>
  );
}

export default PaymentForm;
