import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/form/input";
import Button from "@/components/button";
import Link from "next/link";
import api, { handleAxiosError } from "@/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useStore from "@/store";

type Values = {
  email: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Email must be a valid email address.")
    .required("Email field is required."),
});

const SendEmail = () => {
  const router = useRouter();
  const { setIsLoading } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const submit = async (data: Values) => {
    setIsLoading(true);
    api()
      .post("/adm/auth/forgot-password", data)
      .then(async (res) => {
        if (res.data.success) {
          toast.success(res.data.msg, { theme: "colored" });
          router.push("/auth/login");
        }
      })
      .catch((err: any) => {
        handleAxiosError(err);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full dark:bg-gray-800">
      <form className="mt-6" onSubmit={handleSubmit(submit)}>
        <div className="mb-4 w-full">
          <InputField
            type="text"
            placeholder="your@email.id"
            label="Email"
            className="w-full"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

        <div className="mt-6">
          <Button danger label="Submit" block bold />
        </div>
      </form>

      <div className="flex items-center justify-between mt-4">
        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>

        <a
          href="#"
          className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
        >
          or
        </a>

        <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
      </div>

      <div className="flex items-center mt-3 -mx-2">
        <Link
          href={"/auth/login"}
          className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-slate-400 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
        >
          <span className="hidden mx-2 sm:inline">Log in</span>
        </Link>
      </div>
    </div>
  );
};

export default SendEmail;
