"use client";
import { createPaymentLink, generateToken } from "@/lib/actions/blink";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function LinkForm() {
  const [accessToken, setAccessToken] = useState(null);
  const [errors, setErrors] = useState<Error | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
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
        console.log(errors);
      }
    }
    if (!accessToken) initiatePaymentProcess();
  }, [accessToken, errors]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!accessToken) return;
    const res = await createPaymentLink({
      payment_method: paymentMethod,
      full_name: fullName,
      email,
      mobile_number: mobileNumber,
      accessToken,
      amount: +amount,
    });
    console.log(res);

    if (res.success) {
      router.replace(res.paylink_url);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="w-[180px]">
        <Label htmlFor="payment_method">Payment Method</Label>
        <Select onValueChange={setPaymentMethod}>
          <SelectTrigger className="">
            <SelectValue placeholder="Credit Card" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit-card">Credit Card</SelectItem>
            <SelectItem value="direct-debit">Direct Debit</SelectItem>
            <SelectItem value="open-banking">Open Banking</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="mobile_number">Mobile</Label>
        <Input
          id="mobile_number"
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default LinkForm;
