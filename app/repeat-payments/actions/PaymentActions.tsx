"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  cancelRepeatPaymentById,
  generateToken,
  getAllRepeatPayments,
  getRepeatPaymentById,
} from "@/lib/actions/blink";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaymentCard from "./RepeatPaymentsCard";

type RepeatPayment = {
  id: number;
  status: string;
  customer_name: string;
  customer_email: string;
  payment_type: string;
  reference: string;
  start_payment_date: string;
  recurring_amount: number;
  frequency: string;
};

function PaymentActions() {
  const [accessToken, setAccessToken] = useState(null);
  const [errors, setErrors] = useState<Error | null>(null);
  const [repeatPayments, setRepeatPayments] = useState(null);
  const [repeatPaymentId, setRepeatPaymentId] = useState<number>(0);
  const [repeatPaymentSingle, setRepeatPaymentSingle] = useState(null);

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

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        if (!accessToken) throw new Error("Unauthorised");
        //Params to be added in server action for simplicity
        const res = await getAllRepeatPayments(accessToken);
        console.log(res);
        if (!res.success) throw new Error(res.error);
        setRepeatPayments(res);
      } catch (error) {
        setErrors(error as Error);
        console.log(error);
      }
    })();
  }, [accessToken]);
  return (
    <div className="flex gap-16">
      <div className="flex flex-col gap-4 items-stretch max-w-56">
        <h2>Repeat Payment Actions</h2>
      </div>
      <div className="flex flex-col gap-16">
        <Table>
          <TableCaption>
            A list of repeat payments - Click row for more details on individual
            payment
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead className="text-right">Customer Email</TableHead>
              <TableHead className="text-right">Payment Type</TableHead>
              <TableHead className="text-right">Reference</TableHead>
              <TableHead className="text-right">Start Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Frequency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repeatPayments &&
              repeatPayments?.data.map((payment: RepeatPayment) => {
                return (
                  <TableRow
                    className="cursor-pointer"
                    key={payment.id}
                    onClick={async () => {
                      try {
                        if (!accessToken) throw new Error("Unauthorised");
                        //Params to be added in server action for simplicity
                        const res = await getRepeatPaymentById(
                          accessToken,
                          payment.id
                        );
                        setRepeatPaymentSingle(res);
                      } catch (error) {
                        console.log(error);
                        setErrors(error as Error);
                      }
                    }}
                  >
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.status}</TableCell>
                    <TableCell>{payment.customer_name}</TableCell>
                    <TableCell className="text-right">
                      {payment.customer_email}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.payment_type}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.reference}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.start_payment_date}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.recurring_amount}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.frequency}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <div className="flex  gap-4">
          {repeatPaymentSingle && (
            <PaymentCard
              repeatPayment={repeatPaymentSingle}
              accessToken={accessToken}
              setRepeatPaymentSingle={setRepeatPaymentSingle}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentActions;
