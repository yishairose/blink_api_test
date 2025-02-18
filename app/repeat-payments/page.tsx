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
      <h1 className="text-2xl">Repeat Payment Flow</h1>
      <Button>
        <Link href="repeat-payments/actions" className="text-lg">
          Repeat Payment Action
        </Link>
      </Button>
      <RepeatCardPayment />
    </div>
  );
}

export default page;
