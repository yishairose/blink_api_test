import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-16 flex flex-col gap-8 justify-start items-start ">
      <Button>
        <Link href="/card-mono" className="text-2xl">
          Card Moto
        </Link>
      </Button>
      <Button>
        <Link href="/card-ecom" className="text-2xl">
          Card ECOM
        </Link>
      </Button>
      <Button>
        <Link href="/gpay" className="text-2xl">
          Google Pay
        </Link>
      </Button>
      <Button>
        <Link href="/open-banking" className="text-2xl">
          Open Banking
        </Link>
      </Button>
      <Button>
        <Link href="/direct-debit" className="text-2xl">
          Direct Debit
        </Link>
      </Button>
      <Button>
        <Link href="/pay-link" className="text-2xl">
          Pay Link
        </Link>
      </Button>
    </div>
  );
}
