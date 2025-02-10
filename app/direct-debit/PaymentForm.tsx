import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentIntentResponse } from "@/lib/types";

import { useState } from "react";

function PaymentForm({
  intent,
  accessToken,
}: {
  intent: string;
  accessToken: string;
}) {
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="given_name">First Name</Label>
        <Input
          id="given_name"
          type="string"
          name="given_name"
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="family_name">Family Name</Label>
        <Input
          id="family_name"
          type="string"
          name="family_name"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="account_holder_name">Account Holder Name</Label>
        <Input
          id="account_holder_name"
          type="account_holder_name"
          name="account_holder_name"
          value={accountHolderName}
          onChange={(e) => setAccountHolderName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="branch_code">Sort Code</Label>
        <Input
          id="branch_code"
          type="branch_code"
          name="branch_code"
          value={branchCode}
          onChange={(e) => setBranchCode(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="account_number">Account Number</Label>
        <Input
          id="account_number"
          type="account_number"
          name="account_number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>
      <Button type="submit">Pay</Button>
    </form>
  );
}

export default PaymentForm;
