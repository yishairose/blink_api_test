import React, { useEffect } from "react";

function AcsForm({ html }: { html: string }) {
  useEffect(() => {
    const acsForm = document.querySelector("#form3ds22") as HTMLFormElement;
    acsForm?.submit();
  }, []);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}

export default AcsForm;
