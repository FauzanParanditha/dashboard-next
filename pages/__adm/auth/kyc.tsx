// pages/kyc.tsx
import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

declare global {
  interface Window {
    Persona: any;
  }
}

const KYCPage = () => {
  useEffect(() => {
    const startPersonaVerification = () => {
      if (!window.Persona) {
        console.error("Persona script not loaded");
        return;
      }

      const client = new window.Persona.Client({
        templateId: "itmpl_jB5zUZAq2iG2SGZe9QFUAFm3nvee",
        environmentId: "env_qkeDqMLeK3PpghPSa3ubvgBMmJzw",
        onReady: () => client.open(),
        onComplete: ({ inquiryId, status, fields }: any) => {
          console.log(`Completed inquiry ${inquiryId} with status ${status}`);
          console.log("Verified fields:", fields);
          // Handle the completion of the verification here
        },
      });
    };

    const button = document.getElementById("start-verification");
    button?.addEventListener("click", startPersonaVerification);

    return () => {
      button?.removeEventListener("click", startPersonaVerification);
    };
  }, []);

  return (
    <div>
      <Head>
        <title>KYC Verification</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="text-7xl">KYC Verification</h1>
        <button
          type="button"
          className="py-2 px-4 bg-indigo-500 rounded-lg"
          id="start-verification"
        >
          Start Verification
        </button>
      </div>
      <Script
        src="https://cdn.withpersona.com/dist/persona-v5.0.0.js"
        integrity="sha384-0LXHuG9ceBdEVRdF698trmE0xe0n9LgW8kNTJ9t/mH3U8VXJy0jNGMw/jPz9W82M"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Persona script loaded");
        }}
      />
    </div>
  );
};

export default KYCPage;
