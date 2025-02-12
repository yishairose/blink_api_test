"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cancelTransaction, generateToken } from "@/lib/actions/blink";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
function CancelTransactionForm() {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Error | null>(null);
  const [transactionId, setTransactionId] = React.useState<string>("");
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
  const router = useRouter();
  async function handlesubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    const response = await cancelTransaction(transactionId, accessToken);
    console.log(response);
    if (response.success) {
      alert("Transaction Cancelled Successfully");
      router.replace("/");
    }
  }
  return (
    <form onSubmit={handlesubmit} className="flex flex-col gap-4 p-16">
      <Label className="text-2xl" htmlFor="transaction">
        Cancel Transaction
      </Label>
      <Input
        placeholder="Transaction ID"
        id="transaction"
        className="border"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
      />
      <Button type="submit">Cancel </Button>
    </form>
  );
}

export default CancelTransactionForm;
