import { Button } from "@/components/ui/button";
import { makePaymentEcom } from "@/lib/actions/blink";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AcsForm from "./AcsForm";

export async function hostedFieldsSetup(selector: string) {
  const form: HTMLFormElement | null = document.querySelector(selector);

  if (!form) return;

  try {
    $("input[type='hostedfield:cardNumber']").hostedField({
      nativeEvents: true,
    });
    $("input[type='hostedfield:cardExpiryDate']").hostedField({
      nativeEvents: true,
    });
    $("input[type='hostedfield:cardCvv']").hostedField({
      nativeEvents: true,
    });
  } catch (error) {
    console.log("failed to create fields", error);
  }
}
function getDeviceDetails() {
  $(function () {
    const formID = $("form").attr("id");
    const $form = $("#" + formID);
    const auto = {
      autoSetup: true,
      autoSubmit: true,
    };

    try {
      const hf = $form.hostedForm(auto);
    } catch (e) {
      //Add your exception handling code here
    }

    $("input[type=submit]").val("Pay");
    const screen_width = window && window.screen ? window.screen.width : "0";
    const screen_height = window && window.screen ? window.screen.height : "0";
    const screen_depth =
      window && window.screen ? window.screen.colorDepth : "0";
    const language =
      window && window.navigator
        ? window.navigator.language
          ? window.navigator.language
          : window.navigator.browserLanguage
        : "";
    const java = window && window.navigator ? navigator.javaEnabled() : false;
    const timezone = new Date().getTimezoneOffset();

    $form.find("input[name=device_timezone]").val(timezone);
    $form
      .find("input[name=device_capabilities]")
      .val("javascript" + (java ? ",java" : ""));
    $form.find("input[name=device_accept_language]").val(language);
    $form
      .find("input[name=device_screen_resolution]")
      .val(screen_width + "x" + screen_height + "x" + screen_depth);

    $.getJSON("https://api.ipify.org?format=json", function (data) {
      $form.find("input[name=remote_address]").val(data.ip);
    });
  });
}
function PaymentForm({ html, accessToken }) {
  const [acsForm, setAcsForm] = useState(null);
  const router = useRouter();
  useEffect(() => {
    hostedFieldsSetup("#payment");
    getDeviceDetails();
  }, []);

  type PaymentData = {
    accessToken: string;
    payment_intent: string;
    paymentToken: string;
    type: string;
    customer_email: string;
    customer_name: string;
    customer_address: string;
    customer_postcode: string;
    transaction_unique: string;
  };
  async function handleSubmit(e) {
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
      };

      const res = await makePaymentEcom(data);
      setAcsForm(res.acsform);
      console.log(res);
    } catch (error) {}
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
