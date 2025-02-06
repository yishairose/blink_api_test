import React, { useEffect } from "react";

function AcsForm({ html }) {
  useEffect(() => {
    const acsForm = document.querySelector("#form3ds22");
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
