import api from "@/api";
import { DashboardLayout } from "@/components/layout";
import { useUserContext } from "@/context/user";
import useStore from "@/store";
import axios from "axios";
import Head from "next/head";
import { useState, useCallback, useEffect } from "react";

// pages/kyc.tsx
const PrivyPage = () => {
  const { setIsLoading } = useStore();
  const { user } = useUserContext();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user !== undefined) {
      setUserData({ ...user });
    }
  }, [user]);

  const privyHandler = () => {
    try {
      setIsLoading(true);
      const base_url = process.env.NEXT_PUBLIC_PERSONA_URL;
      console.log(`${base_url}/oauth2/api/v1/token`);
      api()
        .get(`${base_url}/oauth2/api/v1/token`)
        .then((res) => {
          console.log(res);
        });
      // axios
      //   .post(`${base_url}/oauth2/api/v1/token`, {
      //     client_id: "Pandi",
      //     client_secret: "rZPrduCvga2kTt8Sa2lZxV0Qg7JxwEXh",
      //     grant_type: "client_credentials",
      //   })
      //   .then((res) => {
      //     console.log(res);
      //   });
      // Handle the response as needed
    } catch (error) {
      console.error("Error:", error);
      // Handle the error as needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Privy Verification</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="text-7xl">Privy Verification</h1>
        <button
          type="button"
          className="py-2 px-4 bg-indigo-500 rounded-lg"
          onClick={privyHandler}
        >
          Start Verification
        </button>
      </div>
    </DashboardLayout>
  );
};

export default PrivyPage;
