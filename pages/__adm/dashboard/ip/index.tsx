import { DashboardLayout } from "@/components/layout";
import { useEffect, useState } from "react";
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import useSWR from "swr";
import Pagination from "@/components/pagination";
import SearchForm from "@/components/form/search";
import api, { handleAxiosError } from "@/api";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useStore from "@/store";
import ModalIp from "@/components/dashboard/ip/modalIp";
import Head from "next/head";

const AdminPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [empty, setEmpty] = useState(true);
  const { setIsLoading } = useStore();

  const [defaultValue, setDefaultValue] = useState({});
  const [id, setId] = useState(0); //id for update
  const [isUpdate, setIsUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { data: ips, mutate: revalidate } = useSWR(
    `/adm/ip?perPage=${10}&page=${page}&search=${search}`
  );

  useEffect(() => {
    if (ips !== undefined) {
      if (ips?.data?.data?.length !== 0) {
        setEmpty(false);
      } else {
        setEmpty(true);
      }
    }
  }, [ips]);

  //delete ips
  const DeleteIp = (data: any) => {
    const id = data._id;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#991B1B",
      cancelButtonColor: "#1E293B",
      confirmButtonText: "DELETE",
    }).then((result) => {
      if (result.isConfirmed) {
        //delete data
        setIsLoading(true);
        api()
          .delete("/adm/ip/" + id)
          .then((res) => {
            if (res.data.success) {
              //toast
              revalidate({}, true);
              toast.success("Delete Ip Success", { theme: "colored" });
            }
          })
          .catch((err) => {
            handleAxiosError(err);
          })
          .finally(() => setIsLoading(false));
      }
    });
  };

  const CreateIp = () => {
    setDefaultValue({ name: "", ip: "" });
    setIsOpen(true);
    setIsUpdate(false);
  };

  const UpdateIp = (dt: any) => {
    setDefaultValue({ name: dt.name, ip: dt.ip });
    setIsUpdate(true);
    setId(dt._id);
    setIsOpen(true);
  };

  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Dashboard - IP</title>
        </Head>
        <div className="animate-fade-down conatiner mx-auto my-6 bg-white p-4 rounded shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                  List Ip Whitelist
                </h1>
                <p className="mt-2 text-sm text-gray-700"></p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  onClick={() => CreateIp()}
                  className="flex items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Add Ip
                  <HiOutlinePlus className="h-5 w-5" />
                </button>
              </div>
            </div>
            <SearchForm
              search={search}
              setSearch={setSearch}
              revalidate={revalidate}
              placeholder="name"
            />
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Ip
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {empty && (
                        <tr>
                          <td
                            className="border-b text-center border-gray-200 py-6 text-sm font-normal uppercase"
                            colSpan={3}
                          >
                            Data Not Found
                          </td>
                        </tr>
                      )}
                      {ips?.data?.data?.map((ip: any, idx: any) => (
                        <tr key={idx}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {ip.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {ip.ip}
                          </td>
                          <td className="flex items-center justify-center gap-4 py-4 pl-3 pr-4 text-sm font-medium sm:pr-0">
                            <HiOutlinePencil
                              className="h-5 w-5 text-blue-400"
                              onClick={(e: any) => {
                                e.stopPropagation();
                                UpdateIp(ip);
                              }}
                            />
                            <HiOutlineTrash
                              className="h-5 w-5 text-rose-400"
                              onClick={(e: any) => {
                                e.stopPropagation();
                                DeleteIp(ip);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {!empty && (
              <div className="flex justify-center items-center border-t py-4">
                <Pagination
                  paginate={ips?.data?.pagination || {}}
                  onPageChange={(pg) => setPage(pg)}
                  limit={1}
                />
              </div>
            )}
          </div>
          <ModalIp
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            defaultValue={defaultValue}
            revalidate={revalidate}
            isUpdate={isUpdate}
            id={id}
          />
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminPage;
