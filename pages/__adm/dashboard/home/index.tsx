import { DashboardLayout } from "@/components/layout";
import { TypewriterEffectSmooth } from "@/components/beauty/typewriter-effect";
import Head from "next/head";
import useSWR from "swr";
import { useEffect, useState } from "react";

const adminHome = () => {
  const [empty, setEmpty] = useState(true);

  const { data: dashboard, mutate: revalidate } = useSWR(`/adm/dashboard`);

  useEffect(() => {
    if (dashboard !== undefined) {
      if (dashboard?.data?.data?.length !== 0) {
        setEmpty(false);
      } else {
        setEmpty(true);
      }
    }
  }, [dashboard]);

  const words = [
    {
      text: "Welcome",
    },
    {
      text: "To",
    },
    {
      text: "Dashbaord",
      className: "text-rose-600 dark:text-rose-600",
    },
  ];
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Dashboard</title>
        </Head>
        <div className="container mx-auto">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <TypewriterEffectSmooth words={words} />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
            {dashboard?.data?.map((item: any) => (
              <div
                key={item.name}
                className="animate-fade-right overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.stat}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default adminHome;
