import { Button } from "@/components/ui/button";
import Link from "next/link";
import CardPaymentsEcom from "../CardPaymentsEcom";

function page() {
  return (
    <div className="p-16 flex flex-col gap-8 items-start  ">
      <Button>
        <Link href="/" className="text-2xl">
          Home
        </Link>
      </Button>
      <CardPaymentsEcom />
    </div>
  );
}

export default page;
