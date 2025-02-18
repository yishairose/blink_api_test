import React from "react";
import PaymentActions from "./PaymentActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function page() {
  return (
    <div className="p-16">
      <Button className="mb-20 ">
        <Link href="/" className="text-2xl">
          Home
        </Link>
      </Button>
      <PaymentActions />
    </div>
  );
}

export default page;
