import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/form/input";
import Button from "@/components/button";
import Link from "next/link";
import api, { handleAxiosError } from "@/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import HomeLayout from "@/components/layout/home";
import { useUserContext } from "@/context/user";
import useStore from "@/store";
import { useEffect } from "react";
// import { BackgroundGradient } from "@/components/beauty/background-gradient";
import { TextGenerateEffect } from "@/components/beauty/text-generate-effect";
import Head from "next/head";

type Values = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Email must be a valid email address.")
    .required("Email field is required."),
  password: yup.string().required("Password field is required."),
});

const LoginPage = () => {
  const router = useRouter();
  const { auth, revalidate } = useUserContext();
  const { setIsLoading } = useStore();
  useEffect(() => {
    if (auth == "authenticated") {
      router.push("/dashboard/home");
    }
  }, [auth]);

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
      .post("/adm/auth/login", data)
      .then(async (res) => {
        if (res.data.success) {
          await revalidate({}, true);
          toast.success("login success", { theme: "colored" });
          if (router.query?.next) {
            router.push(router.query.next as string);
          } else {
            router.push("/dashboard/home");
          }
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err: any) => {
        handleAxiosError(err);
      })
      .finally(() => setIsLoading(false));
  };

  const words = "Welcome, Please Login first!";
  return (
    <HomeLayout>
      <Head>
        <title>Dashboard - Login</title>
      </Head>
      <div className="flex-grow text-center">
        <TextGenerateEffect words={words} className="my-6" />
        <div className="animate-fade-down animate-delay-10 flex flex-1 justify-center mt-20 mb-10 sm:justify-center items-center pt-6 sm:pt-0">
          {/* <BackgroundGradient className="rounded-[22px] max-w-sm p-4 bg-white dark:bg-zinc-900"> */}
          <div className="w-full max-w-sm p-6 m-auto mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="w-full max-w-sm p-6 m-auto mx-auto bg-white dark:bg-gray-800">
              <div className="flex justify-center mx-auto">
                <img className="w-auto h-8 sm:h-8" src="/favicon.ico" alt="" />
              </div>

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

                <div className="mt-4 w-full">
                  <div className="flex items-center justify-between pb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm text-slate-500 dark:text-gray-200"
                    >
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-red-600 dark:text-gray-400 hover:underline"
                    >
                      Forget Password?
                    </Link>
                  </div>
                  <InputField
                    type="password"
                    className="w-full"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                </div>

                <div className="mt-6">
                  <Button danger label="Sign in" block bold />
                </div>
              </form>
            </div>
          </div>
          {/* </BackgroundGradient> */}
        </div>
      </div>
    </HomeLayout>
  );
};

export default LoginPage;
