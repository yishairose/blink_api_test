import { Button } from "@/components/ui/button";

import React from "react";
import LinkForm from "./LinkForm";
import Link from "next/link";

function page() {
  return (
    <div className="p-16 flex flex-col gap-8 items-start  ">
      <Button>
        <Link href="/" className="text-2xl">
          Home
        </Link>
      </Button>
      <LinkForm />
    </div>
  );
}

export default page;
