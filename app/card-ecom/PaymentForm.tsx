import { Button } from "@/components/ui/button";
import { makePaymentEcom } from "@/lib/actions/blink";
import React, { useEffect, useState } from "react";
import AcsForm from "./AcsForm";
import { getDeviceDetails, setUpHostedfields } from "@/lib/hostedFields";
import { PaymentData } from "@/lib/types";

function PaymentForm({
  html,
  accessToken,
}: {
  html: string;
  accessToken: string;
}) {
  const [acsForm, setAcsForm] = useState(null);
  useEffect(() => {
    //Function being called from hostedFields.ts in lib folder
    //These are the two functions which are necessary to be run when form element is rendered.
    setUpHostedfields("#payment");
    getDeviceDetails();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //Select form element from DOM
    const form: HTMLFormElement | null = document.querySelector("#payment");
    if (!form) return;
    //Create hostedForm instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hostedForm: any = $(form).hostedForm("instance");
    try {
      //Generate payment token
      const response = await hostedForm.getPaymentDetails();
      const paymentToken = response.paymentToken;

      //Get rest of the data from the form
      const formData = new FormData(form);
      //Create object from form data and payment token
      const data = {
        paymentToken,
        ...Object.fromEntries(formData.entries()),
      } as PaymentData;

      //Send request to blink api to make payment (server actions are in blink.ts in lib/actions)
      const res = await makePaymentEcom(data);
      setAcsForm(res.acsform);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {acsForm && <AcsForm html={acsForm} />}
      <form id="payment" method="POST" onSubmit={handleSubmit}>
        <input type="hidden" name="accessToken" value={accessToken} />

        <div
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />

        <Button type="submit">Pay</Button>
      </form>
    </>
  );
}

export default PaymentForm;
