import { handleAxiosError } from "@/api";
import { DashboardLayout } from "@/components/layout";
import { useUserContext } from "@/context/user";
import useStore from "@/store";
import { generateReferenceNumber } from "@/utils/helpers";
import axios from "axios";
import moment from "moment";
import Head from "next/head";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import SearchForm from "@/components/form/search";
import useSWR from "swr";
import Link from "next/link";
import clsx from "clsx";
import Pagination from "@/components/pagination";

// pages/kyc.tsx
const PrivyPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { setIsLoading } = useStore();
  const [empty, setEmpty] = useState(true);
  const { user } = useUserContext();
  let accessToken = "";
  const url = process.env.NEXT_PUBLIC_PRIVY_URL;

  const { data: privys, mutate: revalidate } = useSWR(
    `/adm/privy?perPage=${10}&page=${page}&search=${search}`
  );

  useEffect(() => {
    if (user !== undefined) {
      const userData = { ...user };
    }
  }, [user]);

  useEffect(() => {
    if (privys !== undefined) {
      if (privys?.data?.data?.length !== 0) {
        setEmpty(false);
      } else {
        setEmpty(true);
      }
    }
  }, [privys]);

  const generateSignature = (
    apiKey: any,
    secretKey: any,
    referenceNumber: any,
    channelId: any,
    requestBody: any
  ) => {
    const timestamp = moment().toString(); // Current timestamp

    // Prepare request body and remove unnecessary fields
    const body = { ...requestBody };
    delete body.identity;
    delete body.selfie;
    body.reference_number = referenceNumber;
    body.channel_id = channelId;

    const method = "POST";
    const jsonBody = JSON.stringify(body).replace(/\s/g, ""); // Remove whitespaces

    const bodyMd5 = CryptoJS.MD5(jsonBody).toString(CryptoJS.enc.Base64); // MD5 hash of the JSON body

    const hmacSignature = `${timestamp}:${apiKey}:${method}:${bodyMd5}`;
    const hmac = CryptoJS.HmacSHA256(hmacSignature, secretKey);
    const hmacBase64 = hmac.toString(CryptoJS.enc.Base64);

    const authString = `${apiKey}:${hmacBase64}`;
    const signature = btoa(authString); // Base64 encode the auth string

    return signature;
  };

  const fetchAccessToken = async () => {
    console.log("fetch token");
    let data = JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_PRIVY_CLIENT_SECRET,
      grant_type: "client_credentials",
    });

    //token
    console.log("post");
    await axios
      .post(`/api/oauth2/api/v1/token`, data, {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Basic ${process.env.NEXT_PUBLIC_PRIVY_AUTH}`,
        },
      })
      .then((resToken) => {
        console.log("Res");
        if (resToken.status == 200 || resToken.status == 201) {
          console.log("success");
          accessToken = resToken.data.data.access_token;
          return accessToken;
        }
      })
      .catch((errToken) => {
        handleAxiosError(`Error Token: ${errToken}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchRegister = async () => {
    setIsLoading(true);
    console.log("fetch register");

    await fetchAccessToken();

    const timestamp = moment().toString();

    const referenceNumber = generateReferenceNumber();
    const apiKey = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;
    const secretKey = process.env.NEXT_PUBLIC_PRIVY_CLIENT_SECRET;
    const channelId = process.env.NEXT_PUBLIC_PRIVY_CHANNEL_ID;

    let secondData = {
      reference_number: referenceNumber,
      channel_id: channelId,
      info: "RANDOMSTRING",
      email: "fauzan@pandi.id",
    };

    const signature = generateSignature(
      apiKey,
      secretKey,
      referenceNumber,
      channelId,
      secondData
    );
    console.log("signature");

    axios
      .post(`/api/web/api/v2/register`, secondData, {
        maxContentLength: Infinity,
        headers: {
          Timestamp: timestamp,
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Signature: signature,
        },
      })
      .then((resRegis) => {
        if (resRegis.status == 201) {
          window.open(resRegis.data.data.registration_url, "_blank");
          setIsLoading(false);
        }
      })
      .catch((errRegis) => {
        toast.error(errRegis.message);
        handleAxiosError(`Error Regis: ${errRegis}`);
      });
  };

  const privyHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetchRegister();
      // You can now use the access token to make authorized requests
    } catch (error) {
      console.error("Error:", error);
      // Handle the error as needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Dashboard - Privy</title>
        </Head>
        <div className="animate-fade-down conatiner mx-auto my-6 bg-white p-4 rounded shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                  List Privy
                </h1>
                <p className="mt-2 text-sm text-gray-700"></p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  onClick={privyHandler}
                  className="flex items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Add KYC
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
                          Full Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
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
                            colSpan={4}
                          >
                            Data Not Found
                          </td>
                        </tr>
                      )}
                      {privys?.data?.data?.map((prv: any, idx: any) => (
                        <tr key={idx}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {prv.reference_number}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {prv.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={clsx(
                                prv.status == "verified"
                                  ? "bg-teal-400"
                                  : "bg-rose-400",
                                "inline-flex px-4 rounded text-white py-1 text-xs"
                              )}
                            >
                              {prv.status}
                            </span>
                          </td>
                          <td className="flex items-center justify-center gap-4 py-4 pl-3 pr-4 text-sm font-medium sm:pr-0">
                            <Link href={`/dashboard/privy/${prv._id}`}>
                              <HiOutlinePencil className="h-5 w-5 text-blue-400" />
                            </Link>
                            <HiOutlineTrash
                              className="h-5 w-5 text-rose-400"
                              onClick={(e: any) => {
                                e.stopPropagation();
                                // DeleteAdmin(adm);
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
                  paginate={privys?.data?.pagination || {}}
                  onPageChange={(pg) => setPage(pg)}
                  limit={1}
                />
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default PrivyPage;
