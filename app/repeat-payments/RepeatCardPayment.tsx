"use client";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createIntent, generateToken } from "@/lib/actions/blink";

import { useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";
import { PaymentIntentResponse } from "@/lib/types";

function RepeatCardPayment() {
  const [accessToken, setAccessToken] = useState(null);
  const [errors, setErrors] = useState<Error | null>(null);
  const [intent, setIntent] = useState<
    null | PaymentIntentResponse | { success: false; error: string }
  >(null);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SALE");
  const [layout, setLayout] = useState("basic");
  const [delay, setDelay] = useState(0);

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
    <div className="flex  w-screen justify-between items-center">
      {errors && (
        <div className="text-red-500 w-full text-center">
          <div>{errors.message}</div>
        </div>
      )}
      {intent?.success && accessToken && (
        <PaymentForm
          accessToken={accessToken}
          html={intent?.element.ccMotoElement}
        />
      )}
      {accessToken && !intent && (
        <form className="flex flex-col gap-4 items-start ">
          <h3 className="text-xl font-bold">Create Intent</h3>
          <div className="w-[180px]">
            <Label htmlFor="type">Transaction Type</Label>
            <Select onValueChange={setType}>
              <SelectTrigger className="">
                <SelectValue placeholder="Sale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SALE">Sale</SelectItem>
                <SelectItem value="VERIFY">Verify</SelectItem>
                <SelectItem value="PREAUTH">Preauth</SelectItem>
                <SelectItem value="CREDIT">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[180px]">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="w-[180px]">
            <Label htmlFor="layout">Card Layout</Label>
            <Select onValueChange={setLayout}>
              <SelectTrigger className="">
                <SelectValue placeholder="Basic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="single-line">Single Line</SelectItem>
                <SelectItem value="multi-line">Multi Line</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[180px]">
            <Label htmlFor="delay">Capture Delay</Label>
            <Input
              id="delay"
              placeholder="Delay in days..."
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
            />
          </div>

          <Button
            onClick={async (e) => {
              e.preventDefault();
              if (!accessToken) return;
              const intent = await createIntent(accessToken, {
                transaction_type: type,
                amount,
                card_layout: layout,
                delay_capture_days: delay,
              });
              if (intent) setIntent(intent);
              console.log(intent);
            }}
          >
            Create Intent
          </Button>
        </form>
      )}

      <Script src="https://code.jquery.com/jquery-3.6.3.min.js"></Script>
    </div>
  );
}

export default RepeatCardPayment;
