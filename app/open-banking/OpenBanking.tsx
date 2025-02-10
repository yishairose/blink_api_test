"use client";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createIntent, generateToken, makeOBReq } from "@/lib/actions/blink";

import { useEffect, useState } from "react";

import { PaymentIntentResponse } from "@/lib/types";
import { useRouter } from "next/navigation";

function OpenBanking() {
  const [accessToken, setAccessToken] = useState(null);
  const [errors, setErrors] = useState<Error | null>(null);
  const [intent, setIntent] = useState<
    null | PaymentIntentResponse | { success: false; error: string }
  >(null);
  const [amount, setAmount] = useState(0);
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function initiatePaymentProcess() {
      try {
        const data = await generateToken();
        if (!data.success) throw new Error(data.error);
        console.log(data);
        setAccessToken(data.access_token);
      } catch (error) {
        setErrors(error as Error);
        console.log(error);
      }
    }
    if (!accessToken) initiatePaymentProcess();
  }, [accessToken]);

  return (
    <>
      <h1 className="text-2xl">Card Payment flow Open Banking</h1>
      {accessToken && !intent && (
        <form className="flex flex-col gap-4 items-start ">
          <h3 className="text-xl font-bold">Create Intent</h3>
          <div className="w-[180px]">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="w-[180px]">
            <Label htmlFor="email">Customer Email</Label>
            <Input
              id="email"
              placeholder="Enter email..."
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
          <div className="w-[180px]">
            <Label htmlFor="email">Customer Name</Label>
            <Input
              id="email"
              placeholder="Enter email..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <Button
            onClick={async (e) => {
              e.preventDefault();
              if (!accessToken) return;
              const intent = await createIntent(accessToken, {
                transaction_type: "SALE",
                amount,
                card_layout: "basic",
                delay_capture_days: 0,
                customer_email: customerEmail,
                customer_name: customerName,
              });
              if (intent) setIntent(intent);
              console.log(intent);

              const { payment_intent, transaction_unique } = intent;
              const response = await makeOBReq({
                payment_intent,
                customerEmail,
                customerName,
                transaction_unique,
                accessToken,
              });

              window.open(response.url, "_blank"); // Opens in a new window
            }}
          >
            Create Intent
          </Button>
        </form>
      )}

      <Script src="https://code.jquery.com/jquery-3.6.3.min.js"></Script>
    </>
  );
}

export default OpenBanking;
