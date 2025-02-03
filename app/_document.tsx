import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* External Scripts */}
          <script src="https://code.jquery.com/jquery-3.6.3.min.js" />
          <script src="https://gateway2.blinkpayment.co.uk/sdk/web/v1/js/hostedfields.min.js" />
          <script src="https://secure.blinkpayment.co.uk/assets/js/api/custom.js" />

          {/* External Stylesheet */}
          <link
            rel="stylesheet"
            href="https://secure.blinkpayment.co.uk/assets/css/api.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
