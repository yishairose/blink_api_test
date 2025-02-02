import { Button } from "@/components/ui/button";
import CardPayments from "../CardPaymentsMono";
import Link from "next/link";

function page() {
  return (
    <div className="p-16 flex flex-col gap-8 items-start  ">
      <Button>
        <Link href="/" className="text-2xl">
          Home
        </Link>
      </Button>
      <CardPayments />
    </div>
  );
}

export default page;
