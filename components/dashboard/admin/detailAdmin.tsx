import InputField from "@/components/form/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/button";
import { useEffect } from "react";
import useStore from "@/store";
import api, { handleAxiosError } from "@/api";
import { toast } from "react-toastify";
import { updateAdminSchema } from "@/utils/schema/admin";
import { useRouter } from "next/router";
import SelectField from "@/components/form/select";
import { AdminStatus } from "@/utils/var";

type Values = {
  fullName: string;
  email: string;
  status: string;
};

const DetailAdm = () => {
  const { setIsLoading } = useStore();
  const router = useRouter();
  const { id } = router.query;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    mode: "onBlur",
    resolver: yupResolver(updateAdminSchema),
  });

  const options = [
    {
      value: AdminStatus.ACTIVE,
      label: AdminStatus.ACTIVE,
    },
    {
      value: AdminStatus.BANNED,
      label: AdminStatus.BANNED,
    },
  ];

  const getData = () => {
    setIsLoading(true);
    api()
      .get("/adm/admin/" + id)
      .then((res) => {
        if (res.data.success) {
          const dt = res.data.data;
          reset({
            fullName: dt.fullName,
            email: dt.email,
            status: dt.status,
          });
        }
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (id != undefined) {
      getData();
    }
  }, [id]);

  const onSubmit = (data: Values) => {
    setIsLoading(true);
    api()
      .put("/adm/admin/" + id, data)
      .then((res) => {
        if (res.data.success) {
          getData();
          toast.success("Update Admin success", { theme: "colored" });
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
            Admin Profile
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
                  required
                  disabled
                  error={errors.email?.message}
                />
              </div>
              <div className="mb-4 pr-2">
                <Controller
                  control={control}
                  name="status"
                  render={({ field: { onChange, value } }) => (
                    <SelectField
                      name="status"
                      label="Status"
                      required
                      options={options}
                      value={value}
                      onChange={onChange}
                      error={errors.status?.message}
                    />
                  )}
                />
              </div>
            </div>
            <div className="my-2 grid grid-cols-2">
              <Button success label="Update Data" block bold />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default DetailAdm;
