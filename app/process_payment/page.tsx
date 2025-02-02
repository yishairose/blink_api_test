import { cookies } from "next/headers";
import PaymentForm from "../PaymentForm";
import { makePaymentMOTO } from "@/lib/actions/blink";
import { Button } from "@/components/ui/button";
import Script from "next/script";

async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || "No token found";

  return (
    <div>
      <form id="payment" action={makePaymentMOTO} method="POST">
        <PaymentForm token={token} />
        <Button type="submit">Pay</Button>
      </form>
      <Script src="https://secure.blinkpayment.co.uk/assets/js/api/custom.js"></Script>
    </div>
  );
}

export default page;
