import { Button } from "@/components/ui/button";
import { makePaymentGpay } from "@/lib/actions/blink";
import { getDeviceDetails, setUpHostedfields } from "@/lib/hostedFields";
import { PaymentData } from "@/lib/types";

import React, { useEffect, useRef } from "react";

function PaymentForm({
  htmlCC,
  htmlGp,
  accessToken,
}: {
  htmlCC: string;
  htmlGp: string;
  accessToken: string;
}) {
  useEffect(() => {
    setUpHostedfields("#payment");
    getDeviceDetails();
  }, []);

  const containerRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form: HTMLFormElement | null = document.querySelector("#payment");
    if (!form) return;
    const hostedForm: any = $(form).hostedForm("instance");
    try {
      const response = await hostedForm.getPaymentDetails();
      const paymentToken = response.paymentToken;
      const formData = new FormData(form);
      const data = {
        paymentToken,
        ...Object.fromEntries(formData.entries()),
      } as PaymentData;

      const res = await makePaymentGpay(data);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // Check if scripts have been executed - required for strict mode
    if (window.scriptsExecuted) return;

    // Function to extract scripts from html and execute seperately
    const executeScripts = () => {
      if (!containerRef.current) return;

      // Find all script tags
      const scripts = containerRef.current.getElementsByTagName("script");

      Array.from(scripts).forEach((oldScript) => {
        // Create a new script element
        const newScript = document.createElement("script");

        // Copy all attributes
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        console.log(scripts);

        // Copy the content
        newScript.innerHTML = oldScript.innerHTML;

        // Replace old script with new one
        if (oldScript.parentNode) {
          oldScript.parentNode.replaceChild(newScript, oldScript);
        }
      });
    };

    executeScripts();
    window.scriptsExecuted = true;
  }, []);

  return (
    <>
      <form id="payment" method="POST" onSubmit={handleSubmit}>
        <input type="hidden" name="accessToken" value={accessToken} />

        <div
          dangerouslySetInnerHTML={{
            __html: htmlCC,
          }}
        />
      </form>
      <form id="gpPayment" method="POST" ref={containerRef} className="">
        <div
          dangerouslySetInnerHTML={{
            __html: htmlGp,
          }}
        />
      </form>
    </>
  );
}

export default PaymentForm;
