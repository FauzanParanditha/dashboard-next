import { NextPage } from "next";
import useStore from "@/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import SendEmail from "@/components/reset-password/SendEmail";
import ChangePassword from "@/components/reset-password/ChangePassword";
import HomeLayout from "@/components/layout/home";

const ForgotPassword: NextPage = () => {
  const { setIsLoading } = useStore();
  const [isReset, setIsReset] = useState(false);
  const router = useRouter();
  const { email } = router.query;
  const { token } = router.query;
  useEffect(() => {
    setIsLoading(false);
    if (token != undefined || email != undefined) {
      setIsReset(true);
    }
  }, [token, email]);
  return (
    <HomeLayout>
      <Head>
        <title>Reset Page</title>
        <meta name="description" content="reset page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex-1 justify-center mt-20 mb-10 sm:justify-center items-center pt-6 sm:pt-0">
        <div className="w-full max-w-sm p-6 m-auto mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-8 sm:h-8" src="/favicon.ico" alt="" />
          </div>
          {isReset ? <ChangePassword /> : <SendEmail />}
        </div>
      </div>
    </HomeLayout>
  );
};
export default ForgotPassword;
