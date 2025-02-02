import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-16 flex flex-col gap-8 justify-start items-start ">
      <Button>
        <Link href="/card-mono" className="text-2xl">
          Card Mono
        </Link>
      </Button>
      <Button>
        <Link href="/card-ecom" className="text-2xl">
          Card ECOM
        </Link>
      </Button>
    </div>
  );
}
