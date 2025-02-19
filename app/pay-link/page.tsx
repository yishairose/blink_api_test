import { Button } from "@/components/ui/button";

import React from "react";
import LinkForm from "./LinkForm";
import Link from "next/link";
import PayLinks from "./PayLinks";

function page() {
  return (
    <div className="p-16 flex flex-col gap-8 items-start  ">
      <Button>
        <Link href="/" className="text-2xl">
          Home
        </Link>
      </Button>
      <div className="flex flex-col justify-between w-full">
        <LinkForm />
        <PayLinks />
      </div>
    </div>
  );
}

export default page;
