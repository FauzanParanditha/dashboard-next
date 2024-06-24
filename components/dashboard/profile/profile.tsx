import InputField from "@/components/form/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Button from "@/components/button";
import { useUserContext } from "@/context/user";
import { useEffect } from "react";
import useStore from "@/store";
import api, { handleAxiosError } from "@/api";
import { toast } from "react-toastify";
import { updateAdminSchema } from "@/utils/schema/admin";

type Values = {
  fullName: string;
  email: string;
  status: string;
};

const DetailProfile = () => {
  const { user } = useUserContext();
  const { setIsLoading } = useStore();

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<Values>({
    mode: "onBlur",
    resolver: yupResolver(updateAdminSchema),
  });
  useEffect(() => {
    if (user !== undefined) {
      const userData = { ...user };
      reset({
        fullName: userData.fullName,
        status: userData.status,
        email: userData.email,
      });
    }
  }, [user]);
  const onSubmit = (data: Values) => {
    setIsLoading(true);
    api()
      .post("/adm/profile", data)
      .then((res) => {
        if (res.data.success) {
          toast.success("Update profile success", { theme: "colored" });
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
        <div className="col-span-full xl:col-span-12 bg-white shadow-lg rounded-md p-4 dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-slate-600 dark:bg-slate-800 dark:border-slate-600">
          <h2 className="text-xl font-semibold text-slate-500 dark:text-white">
            Your Profile
          </h2>
          <div className="border-b-2 border-slate-400 dark:border-red-900"></div>

          <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-1">
              <div className="mb-4 pr-3">
                <InputField
                  placeholder="jhon"
                  label="Full Name"
                  className="w-full"
                  {...register("fullName")}
                  value={getValues("fullName")}
                  required
                  error={errors.fullName?.message}
                />
              </div>
              <div className="mb-4 pr-3">
                <InputField
                  type="email"
                  label="Email"
                  placeholder="your@email.id"
                  className="w-full"
                  {...register("email")}
                  value={getValues("email")}
                  required
                  error={errors.email?.message}
                />
              </div>
            </div>

            <div className="my-2 grid grid-cols-2">
              <Button danger label="Update Data" block bold />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default DetailProfile;
