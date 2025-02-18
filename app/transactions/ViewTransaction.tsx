"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  cancelTransaction,
  generateToken,
  getTransaction,
} from "@/lib/actions/blink";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import TransactionCard from "./TransactionCard";

function ViewTransaction() {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Error | null>(null);
  const [transactionId, setTransactionId] = React.useState<string>("");
  const [transaction, setTransaction] = React.useState<any | null>(null);
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

  async function handlesubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    const response = await getTransaction(transactionId, accessToken);
    console.log(response);
    if (response.success) {
      setTransactionId("");
      setTransaction(response);
    }
  }
  return (
    <>
      <form onSubmit={handlesubmit} className="flex flex-col gap-4 p-16">
        <Label className="text-2xl" htmlFor="transaction">
          View Transaction Details
        </Label>
        <Input
          placeholder="Transaction ID"
          id="transaction"
          className="border"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
        <Button type="submit">Submit </Button>
        {transaction && transaction.success && (
          <TransactionCard
            accessToken={accessToken}
            transaction={transaction}
            setTransaction={setTransaction}
          />
        )}
      </form>
    </>
  );
}

export default ViewTransaction;
