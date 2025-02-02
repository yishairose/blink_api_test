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
  makePaymentMOTO,
  processPayment,
} from "@/lib/actions/blink";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";

function CardPayments() {
  const [data, setData] = useState<null | any>(null);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SALE");
  const [layout, setLayout] = useState("basic");
  const [delay, setDelay] = useState(0);
  const formRef = useRef(null);
  const [intent, setIntent] = useState(null);

  useEffect(() => {
    async function initiatePaymentProcess() {
      const data = await generateToken();
      setData(data);
    }
    if (!data) initiatePaymentProcess();
  }, [data]);
  return (
    <>
      <h1 className="text-2xl">Card Payment flow MONO</h1>

      <form
        id="payment"
        action={makePaymentMOTO}
        className={`${intent ? "block" : "hidden"}`}
      >
        {data && (
          <input type="hidden" name="accessToken" value={data.access_token} />
        )}
        {intent && (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: intent?.element.ccMotoElement,
              }}
            />
            <Button type="submit">Pay</Button>
            <Script src="https://secure.blinkpayment.co.uk/assets/js/api/custom.js"></Script>
          </>
        )}
      </form>

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
      <Script src="https://code.jquery.com/jquery-3.6.3.min.js"></Script>
      <Script src="https://gateway2.blinkpayment.co.uk/sdk/web/v1/js/hostedfields.min.js"></Script>
    </>
  );
}

export default CardPayments;
