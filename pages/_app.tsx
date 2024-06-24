import api from "@/api";
import Loader from "@/components/loading";
import { UserContextProvider } from "@/context/user";
import useStore from "@/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }: AppProps) {
  const { isLoading, setIsLoading } = useStore();
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5"
        />
      </Head>
      <SWRConfig
        value={{
          revalidateOnFocus: true,
          revalidateOnMount: true,
          refreshWhenHidden: false,
          fetcher: (url) =>
            api()
              .get(url)
              .then(({ data }) => data),
        }}
      >
        <UserContextProvider>
          {isLoading && <Loader />}
          <Component {...pageProps} />
        </UserContextProvider>
        <ToastContainer
          position="top-center"
          hideProgressBar={false}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
      </SWRConfig>
    </>
  );
}
