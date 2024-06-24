import axios, { AxiosError } from "axios";
import { getCookie, deleteCookie } from "cookies-next";
import { toast } from "react-toastify";
import { jwtConfig } from "@/utils/var";

const api = () => {
  const Axios = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_CLIENT_API_URL || process.env.SERVER_API_URL,
    withCredentials: true,
    timeout: 30000,
  });

  //request
  // Axios.interceptors.request.use((config: any) => {
  //   const token = getCookie(jwtConfig.accessTokenName);
  //   if (token) {
  //     config.headers.Authorization = token;
  //   }
  //   return config;
  // });
  return Axios;
};

export const handleAxiosError = (error: any) => {
  console.log(error);
  if (typeof error === "object" && error !== null) {
    if (error.response) {
      let msg = error.response?.data?.msg;
      switch (error.response?.status) {
        case 401:
          toast.error(
            error.response?.data?.msg
              ? error.response.data.msg
              : "Unauthorized",
            { theme: "colored" }
          );
          break;
        case 422:
          //check type error is object
          if (
            error.response?.data?.errors != undefined &&
            typeof error.response?.data?.errors == "object"
          ) {
            //loop error
            error.response?.data?.errors.forEach((item: any) => {
              toast.error(item.field + " : " + item.reason, {
                theme: "colored",
              });
            });
          } else {
            toast.error(error.response?.data?.msg, { theme: "colored" });
          }
          break;
        default:
          toast.error(msg ? msg : "internal server error", {
            theme: "colored",
          });
          break;
      }
    }
  }
};

export default api;
