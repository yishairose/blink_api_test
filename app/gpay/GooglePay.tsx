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
import {
  createIntent,
  generateToken,
  makePaymentGpay,
} from "@/lib/actions/blink";

import { useEffect, useRef, useState } from "react";
import PaymentForm from "./PaymentForm";

function GooglePay() {
  const [data, setData] = useState<unknown | null>(null);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SALE");
  const [layout, setLayout] = useState("basic");
  const [delay, setDelay] = useState(0);
  const [intent, setIntent] = useState(null);
  const paymentFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function initiatePaymentProcess() {
      const data = await generateToken();
      setData(data);
    }
    if (!data) initiatePaymentProcess();
  }, [data]);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(paymentFormRef.current);
    const formDataObject = Object.fromEntries(formData.entries());
    makePaymentGpay(formDataObject);
  }

  return (
    <>
      <h1 className="text-2xl">Card Payment flow Google Pay</h1>
      {intent?.id ? (
        <PaymentForm
          htmlCC={intent?.element.ccElement}
          htmlGp={intent?.element.gpElement}
          accessToken={data?.access_token}
        />
      ) : (
        <div className="text-red-500 w-full text-center">
          <div>{intent?.message}</div>
          <div>{intent?.data?.amount[0]}</div>
        </div>
      )}
      {data && !intent && (
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
              if (!data) return;
              const intent = await createIntent(data?.access_token, {
                transaction_type: type,
                amount,
                card_layout: layout,
                delay_capture_days: delay,
              });
              if (intent) setIntent(intent);
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

export default GooglePay;
