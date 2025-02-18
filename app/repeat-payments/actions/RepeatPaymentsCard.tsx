import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  cancelRepeatPaymentById,
  deleteRepeatPaymentById,
} from "@/lib/actions/blink";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function PaymentCard({
  repeatPayment,
  accessToken,
  setRepeatPaymentSingle,
}) {
  const [errors, setErrors] = useState<Error | null>(null);
  const { toast } = useToast();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Payment Details</CardTitle>
        <CardDescription>Payment ID: {repeatPayment.id}</CardDescription>
        <Button
          className="self-end"
          variant={"destructive"}
          onClick={async () => {
            try {
              if (!accessToken) throw new Error("Unauthorised");
              //Params to be added in server action for simplicity

              const res = await deleteRepeatPaymentById(
                accessToken,
                repeatPayment.id
              );
              if (res.success) console.log("Repeat Payment Deleted");
              if (!res.success) throw new Error(res.error);
              setRepeatPaymentSingle(null);
            } catch (error) {
              console.log(error);
              setErrors(error as Error);
              toast({
                title: "Error",
                description: errors ? errors.message : "Something went wrong",
                variant: "destructive",
                duration: 5000,
              });
            }
          }}
        >
          Delete Payment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <p>
              <strong>Name:</strong> {repeatPayment.customer_name}
            </p>
            <p>
              <strong>Email:</strong> {repeatPayment.customer_email}
            </p>
            <p>
              <strong>Reference:</strong> {repeatPayment.reference}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Schedule</h3>
            <p>
              <strong>Type:</strong> {repeatPayment.payment_type}
            </p>
            <p>
              <strong>Frequency:</strong> Every{" "}
              {repeatPayment.frequency_duration} {repeatPayment.frequency}
            </p>
            <p>
              <strong>Amount:</strong> {repeatPayment.currency}{" "}
              {repeatPayment.recurring_amount}
            </p>
            <p>
              <strong>Start Date:</strong> {repeatPayment.start_payment_date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Badge
            variant={
              repeatPayment.status === "Cancelled" ? "destructive" : "default"
            }
          >
            {repeatPayment.status}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold mb-2">Recurring Payments</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recurring ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repeatPayment?.recurring_data.map((payment) => (
                <TableRow key={payment.recurring_id}>
                  <TableCell>{payment.recurring_id}</TableCell>
                  <TableCell>{payment.payment_date}</TableCell>
                  <TableCell>{payment.reference}</TableCell>
                  <TableCell>
                    {payment.currency} {payment.processed_amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "Captured" ? "default" : "secondary"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={"destructive"}
                      className="items-center"
                      onClick={async () => {
                        try {
                          if (!accessToken) throw new Error("Unauthorised");
                          //Params to be added in server action for simplicity
                          const res = await cancelRepeatPaymentById(
                            accessToken,
                            repeatPayment.id,
                            payment.recurring_id
                          );
                          if (res.success) console.log("Repeat Payment Cancel");
                          if (!res.success) throw new Error(res.error);
                        } catch (error) {
                          setErrors(error as Error);
                          toast({
                            title: "Error",
                            description: errors
                              ? errors.message
                              : "Something went wrong",
                            variant: "destructive",
                            duration: 5000,
                          });
                        }
                      }}
                    >
                      Cancel Payments
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
