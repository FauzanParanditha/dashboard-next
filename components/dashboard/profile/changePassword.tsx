import React from "react";
import InputField from "@/components/form/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/button";
import { useUserContext } from "@/context/user";
import { useEffect } from "react";
import api, { handleAxiosError } from "@/api";
import useStore from "@/store";
import { toast } from "react-toastify";
import { updatePasswordSchema } from "@/utils/schema/admin";

interface Values {
  email: string;
  old_password: string;
  password: string;
  password_confirmation?: string;
}

const ChangePasswordProfile = () => {
  const { user } = useUserContext();
  const { setIsLoading } = useStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Values>({
    mode: "onBlur",
    resolver: yupResolver(updatePasswordSchema),
  });

  useEffect(() => {
    if (user !== undefined) {
      setValue("email", user.email);
    }
  }, [user]);

  const onSubmit = (data: Values) => {
    setIsLoading(true);
    api()
      .post("/adm/profile/change-password", data)
      .then((res) => {
        if (res.data.success) {
          toast.success("Change password success", { theme: "colored" });
          reset({
            email: user.email,
            old_password: "",
            password: "",
            password_confirmation: "",
          });
        }
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-full xl:col-span-12 bg-white shadow-lg rounded-md  p-4 dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-slate-600 dark:bg-slate-800 dark:border-slate-600">
          <h2 className="text-xl font-semibold text-slate-500 dark:text-white">
            Change Password
          </h2>
          <div className="border-b-2 border-slate-400 dark:border-red-900"></div>

          <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="mb-4 pr-3">
                <InputField
                  type="email"
                  placeholder="your@email.id"
                  label="Email"
                  className="w-full"
                  {...register("email")}
                  disabled
                  error={errors.email?.message}
                />
              </div>

              <div className="mb-4 pr-3">
                <InputField
                  type="password"
                  label="Old Password"
                  className="w-full"
                  {...register("old_password")}
                  error={errors.old_password?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="mb-4 pr-3">
                <InputField
                  type="password"
                  label="New Password"
                  className="w-full"
                  {...register("password")}
                  error={errors.password?.message}
                />
              </div>

              <div className="mb-4 pr-3">
                <InputField
                  type="password"
                  label="Confirm Password"
                  className="w-full"
                  {...register("password_confirmation")}
                  error={errors.password_confirmation?.message}
                />
              </div>
            </div>
            <div className="my-2 grid grid-cols-2">
              <Button danger label="Change Password" block bold />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordProfile;
