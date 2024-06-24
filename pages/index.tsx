import HomeLayout from "@/components/layout/home";
import Head from "next/head";
import { Fragment } from "react";

export default function Home() {
  return (
    <>
      <HomeLayout>
        <Head>
          <title>Hero</title>
        </Head>
        <div className="min-h-screen flex justify-center items-center">
          <h1>HELLO WORLD!</h1>
        </div>
      </HomeLayout>
    </>
  );
}
