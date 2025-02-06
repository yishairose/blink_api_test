import { Button } from "@/components/ui/button";
import CardPaymentsEcom from "./CardPaymentsEcom";
import Link from "next/link";

function page() {
  return (
    <div className="p-16 flex flex-col gap-8 items-start justify-start  ">
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
