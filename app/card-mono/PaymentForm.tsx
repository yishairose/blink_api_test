import { Button } from "@/components/ui/button";
import { makePaymentMOTO } from "@/lib/actions/blink";
import { setUpHostedfields } from "@/lib/hostedFields";
import { PaymentData } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function PaymentForm({
  html,
  accessToken,
}: {
  html: string;
  accessToken: string;
}) {
  const router = useRouter();
  useEffect(() => {
    setUpHostedfields("#payment");
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //Select form element from DOM
    const form: HTMLFormElement | null = document.querySelector("#payment");
    if (!form) return;
    //Create hostedForm instance
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
    } catch (error) {
      console.error(error);
    }
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
