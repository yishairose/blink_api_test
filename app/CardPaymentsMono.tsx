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
} from "@/lib/actions/blink";

import { Fragment, useEffect, useRef, useState } from "react";

function CardPaymentsMono() {
  const [data, setData] = useState<null | any>(null);
  const [error, setError] = useState<null | string>(null);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SALE");
  const [layout, setLayout] = useState("basic");
  const [delay, setDelay] = useState(0);
  const [intent, setIntent] = useState(null);
  const formRef = useRef(null);
  // const [isFormLoaded, setIsFormLoaded] = useState(false);

  // useEffect(() => {
  //   console.log("Form ref", formRef.current);
  //   if (formRef.current) {
  //     setIsFormLoaded(true);
  //     console.log("Form loaded");
  //     // Load external script dynamically
  //     const script1 = document.createElement("script");
  //     script1.src =
  //       "https://gateway2.blinkpayment.co.uk/sdk/web/v1/js/hostedfields.min.js";
  //     script1.async = true;
  //     document.body.appendChild(script1);
  //     const script2 = document.createElement("script");
  //     script2.src = "https://secure.blinkpayment.co.uk/assets/js/api/custom.js";
  //     script2.async = true;
  //     document.body.appendChild(script2);

  //     return () => {
  //       document.body.removeChild(script1);
  //       document.body.removeChild(script2);
  //       console.log("Script removed when form is unmounted");
  //     };
  //   }
  // }, [intent]);

  useEffect(() => {
    async function initiatePaymentProcess() {
      try {
        const data = await generateToken();
        if (!data.success) throw new Error(data.error);
        console.log(data);
        setData(data);
      } catch (error) {
        setError(error.message);
        console.log(error);
      }
    }
    if (!data) initiatePaymentProcess();
  }, [data]);

  return (
    <>
      <h1 className="text-2xl">Card Payment flow MONO</h1>
      {error && (
        <div className="text-red-500 w-full text-center">
          <div>{error}</div>
        </div>
      )}
      {intent?.id ? (
        <>
          <form id="payment" action={makePaymentMOTO} ref={formRef}>
            {data && (
              <input
                type="hidden"
                name="accessToken"
                value={data.access_token}
              />
            )}

            <div
              dangerouslySetInnerHTML={{
                __html: intent?.element.ccMotoElement,
              }}
            />

            <Button type="submit">Pay</Button>
          </form>

          <script
            async
            id="blink-hosted-fields"
            src="https://gateway2.blinkpayment.co.uk/sdk/web/v1/js/hostedfields.min.js"
          ></script>
          <script
            async
            id="custom"
            src="https://secure.blinkpayment.co.uk/assets/js/api/custom.js"
          ></script>
        </>
      ) : (
        <div className="text-red-500 w-full text-center">
          <div>{intent?.message}</div>
          <div>{intent?.data?.amount[0]}</div>
        </div>
      )}
      {data?.success && !intent && (
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
    </>
  );
}

export default CardPaymentsMono;
