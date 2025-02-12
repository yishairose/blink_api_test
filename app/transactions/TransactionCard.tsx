import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Mail, User, RefreshCcw, Globe, X } from "lucide-react";

interface TransactionData {
  transaction_id: string;
  status: string;
  message: string;
  amount: string;
  refunded_amount: string;
  currency: string;
  payment_source: string;
  customer_name: string;
  cutomer_email: string;
  card_number_mask: string;
}

interface TransactionCardProps {
  transaction?: {
    data: TransactionData;
  };
  setTransaction: (transaction: any) => void;
}

export default function TransactionCard({
  transaction,
  setTransaction,
}: TransactionCardProps) {
  const data = transaction?.data || ({} as TransactionData);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Transaction Details
          </CardTitle>
          <Badge variant="default" className="text-sm">
            {data.status || "Unknown"}
          </Badge>
          <button onClick={() => setTransaction(null)}>
            <X className="w-6 h-6" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              ID
            </p>
            <p className="text-lg font-semibold">
              {data.transaction_id || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Amount
            </p>
            <p className="text-lg font-semibold flex items-center">
              {data.amount || "0"} {data.currency || "GBP"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Refunded Amount
            </p>
            <p className="text-lg font-semibold flex items-center">
              <RefreshCcw className="w-4 h-4 mr-1" />
              {data.refunded_amount || "0"} {data.currency || "USD"}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Message
            </p>
            <p className="text-base">{data.message || "No message"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Payment Source
            </p>
            <p className="text-base flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              {data.payment_source || "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Card Number
            </p>
            <p className="text-base flex items-center">
              <CreditCard className="w-4 h-4 mr-1" />
              {data.card_number_mask || "XXXX-XXXX-XXXX-XXXX"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Customer Name
            </p>
            <p className="text-base flex items-center">
              <User className="w-4 h-4 mr-1" />
              {data.customer_name || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Customer Email
            </p>
            <p className="text-base flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {data.cutomer_email || "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
