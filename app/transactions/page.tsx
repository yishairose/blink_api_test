import { Button } from "@/components/ui/button";

import Link from "next/link";
import CancelTransactionForm from "./CancelTransactionForm";
import ViewTransaction from "./ViewTransaction";

function page() {
  return (
    <div className="p-16 flex flex-col gap-8 items-start  ">
      <Button>
        <Link href="/" className="text-2xl">
          Home
        </Link>
      </Button>
      <div className="flex flex-row gap-8">
        <CancelTransactionForm />
        <ViewTransaction />
      </div>
    </div>
  );
}

export default page;
