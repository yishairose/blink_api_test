"use client";

function PaymentForm({ token }: { token: string }) {
  const htmlForm = localStorage.getItem("htmlForm");
  if (!htmlForm) return <p>No form found</p>;

  return (
    <div>
      <input type="hidden" name="accessToken" value={token} />
      <div
        dangerouslySetInnerHTML={{
          __html: htmlForm,
        }}
      />
    </div>
  );
}

export default PaymentForm;
