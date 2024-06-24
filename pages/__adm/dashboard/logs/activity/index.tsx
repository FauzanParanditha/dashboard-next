import Head from "next/head";
import { DashboardLayout } from "@/components/layout/";
import useSWR from "swr";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import SearchForm from "@/components/form/search";
import Pagination from "@/components/pagination";

const LogActivityPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [empty, setEmpty] = useState(true);

  const { data: activity, mutate: revalidate } = useSWR(
    "adm/logs/activity-log?perPage=10&page=" + page + "&search=" + search
  );
  useEffect(() => {
    if (activity !== undefined) {
      if (activity?.data?.data?.length > 0) {
        setEmpty(false);
      } else {
        setEmpty(true);
      }
    }
  }, [activity]);

  const handlePageClick = (selectedPage: number) => {
    setPage(selectedPage + 1);
  };

  return (
    <>
      <Head>
        <title>Activity List</title>
      </Head>
      <DashboardLayout>
        <h4 className="my-4 font-bold text-2xl">List Activity</h4>
        <div className="mt-8 rounded-2xl bg-white text-slate-700">
          <div className="flex items-center justify-between px-8 pt-4">
            <SearchForm
              search={search}
              setSearch={setSearch}
              revalidate={revalidate}
              placeholder="Name"
            />
          </div>
          <div className="container mx-auto">
            <div className="py-1">
              <div className="py-2">
                <div className="max-w-full overflow-x-auto rounded-lg">
                  <table className="w-full leading-normal text-slate-500">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="border-b border-gray-200  px-5 py-3 text-left text-sm font-normal uppercase"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="border-b border-gray-200 px-5 py-3 text-left text-sm font-normal uppercase"
                        >
                          do
                        </th>
                        <th
                          scope="col"
                          className="border-b border-gray-200 px-5 py-3 text-left text-sm font-normal uppercase"
                        >
                          Created_at
                        </th>
                        <th
                          scope="col"
                          className="border-b border-gray-200 px-5 py-3 text-left text-sm font-normal uppercase"
                        >
                          Do Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-400">
                      {empty && (
                        <tr>
                          <td
                            className="border-b text-center border-gray-200 py-6 text-sm font-normal uppercase"
                            colSpan={4}
                          >
                            Data Not Found
                          </td>
                        </tr>
                      )}
                      {activity?.data?.data?.map((dt: any, index: any) => {
                        return (
                          <tr key={index} className="border-b">
                            <td className="border-gray-200 p-5 text-sm">
                              <div className="flex items-center">
                                {dt.data.fullName}
                              </div>
                            </td>
                            <td className="border-gray-200 p-5 text-sm">
                              <div className="flex items-center">{dt.do}</div>
                            </td>
                            <td className="border-gray-200 p-5 text-sm">
                              <p className="whitespace-nowrap">
                                {dayjs(dt._created).format("DD-MM-YYYY")}
                              </p>
                            </td>
                            <td className="border-gray-200 p-5 text-sm">
                              <p className="whitespace-nowrap">
                                {dayjs(dt.do_time).format("HH:mm:ss")}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-center m-5">
                <Pagination
                  paginate={activity?.data?.pagination || {}}
                  onPageChange={(pg) => setPage(pg)}
                  limit={1}
                />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default LogActivityPage;
