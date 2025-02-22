"use client";

import {
  generateToken,
  getAllPayLinks,
  paylinkNotification,
  updatePayLink,
} from "@/lib/actions/blink";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PayLink } from "@/lib/types";

function PayLinks() {
  const [accessToken, setAccessToken] = useState(null);
  const [errors, setErrors] = useState<Error | null>(null);

  const [payLinks, setPayLinks] = useState<PayLink[]>([]);
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

  useEffect(() => {
    (async () => {
      if (!accessToken) return;
      try {
        const res = await getAllPayLinks(accessToken);
        if (res.data.length > 0) setPayLinks(res.data);
      } catch (error) {
        setErrors(error as Error);
        console.log(error);
      }
    })();
  }, [accessToken]);
  return (
    <div>
      <h1 className="text-2xl mb-16">Paylinks</h1>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Created By</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Resend</TableHead>
            <TableHead className="text-right">Update</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payLinks &&
            payLinks?.map((link) => {
              return (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">{link.id}</TableCell>
                  <TableCell>{link.paylink_url}</TableCell>
                  <TableCell>{link.status}</TableCell>
                  <TableCell className="text-right">
                    {link.created_by}
                  </TableCell>
                  <TableCell className="text-right">{link.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!accessToken) return;
                        const res = await paylinkNotification(
                          accessToken,
                          link.id
                        );
                        console.log(res);
                      }}
                    >
                      Resend Notification
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    {
                      //New email hardcoded in docs
                    }
                    <Button
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!accessToken) return;
                        const res = await updatePayLink(accessToken, link.id);
                        console.log(res);
                      }}
                    >
                      Update Email
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}

export default PayLinks;
