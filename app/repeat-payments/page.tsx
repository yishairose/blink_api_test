import { Button } from "@/components/ui/button";

import Link from "next/link";
import RepeatCardPayment from "./RepeatCardPayment";

function page() {
  return (
    <div className="p-16 flex flex-col gap-8 items-start  ">
      <Button>
        <Link href="/" className="text-2xl">
          Home
        </Link>
      </Button>
      <RepeatCardPayment />
    </div>
  );
}

export default page;
