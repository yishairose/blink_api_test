"use client";
import Script from "next/script";
import Link from "next/link";
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
  makePaymentMOTO,
  testPaymentForm,
} from "@/lib/actions/blink";
import { useRef, useState } from "react";
import Head from "next/head";
import test from "node:test";
function CardPayments() {
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SALE");
  const [layout, setLayout] = useState("basic");
  const [delay, setDelay] = useState(0);
  const formRef = useRef(null);
  const [intent, setIntent] = useState(null);

  return (
    <>
      <h1 className="text-2xl">Card Payment flow MONO</h1>
      <Button
        onClick={async () => {
          const data = await generateToken();
          setData(data);
        }}
        className="self-start"
      >
        Start Payment
      </Button>
      {data && (
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
              console.log(intent);
            }}
          >
            Create Intent
          </Button>
        </form>
      )}
      {intent && (
        <form
          ref={formRef}
          method="POST"
          id="payment"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(formRef.current);
            const paymentData = Object.fromEntries(formData.entries());
            makePaymentMOTO(data.access_token, paymentData);
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: intent?.element.ccMotoElement }}
          />
          <Button type="submit">Pay</Button>
        </form>
      )}
      <Script src="https://code.jquery.com/jquery-3.6.3.min.js" />
      <Script src="https://gateway2.blinkpayment.co.uk/sdk/web/v1/js/hostedfields.min.js" />
      <Script src="https://secure.blinkpayment.co.uk/assets/js/api/custom.js" />
    </>
  );
}

export default CardPayments;
