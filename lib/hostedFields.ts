//Written in TypeScript. Types can be ignored in regular JavaScript
export async function setUpHostedfields(paymentForm: string) {
  //Select form element from DOM
  const form: HTMLFormElement | null = document.querySelector(paymentForm);
  //Check that form exists
  if (!form) return;

  //Connect fields to hostedFields library
  //Fields selected using jquery as .hostedField method is attached to the jquery object returned from the selector and not a regular DOM Element.
  //nativeEvents:true insure native javascript events are accessoble on input fields
  $("input[type='hostedfield:cardNumber']").hostedField({
    nativeEvents: true,
  });
  $("input[type='hostedfield:cardExpiryDate']").hostedField({
    nativeEvents: true,
  });
  $("input[type='hostedfield:cardCvv']").hostedField({
    nativeEvents: true,
  });
}

//Function from custom js which gets device details
export function getDeviceDetails() {
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
