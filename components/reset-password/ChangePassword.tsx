import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputField from "@/components/form/input";
import Button from "@/components/button";
import api, { handleAxiosError } from "@/api";
import useStore from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import YupPassword from "yup-password";
YupPassword(yup);

type ResetData = {
  token: string;
  email: string;
  password: string;
  password_confirmation?: string;
};
const schema = yup.object({
  token: yup.string().required("token is required"),
  email: yup.string().email("email is not valid").required("email is required"),
  password: yup
    .string()
    .min(8, "min 8 character")
    .minLowercase(1, "password must contain at least 1 lower case letter")
    .minUppercase(1, "password must contain at least 1 upper case letter")
    .minNumbers(1, "password must contain at least 1 number")
    .minSymbols(1, "password must contain at least 1 special character")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "password not same"),
});

const ChangePassword = () => {
  const { setIsLoading } = useStore();
  const router = useRouter();
  const { email } = router.query;
  const { token } = router.query;

  useEffect(() => {
    if (email != undefined) {
      setValue("email", String(email));
    }
    if (token != undefined) {
      setValue("token", String(token));
    }
  }, [email, token]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetData>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: ResetData) => {
    setIsLoading(true);
    const token = router.query.token;
    const email = router.query.email;
    api()
      .post(`/adm/auth/reset-password?token=${token}&email=${email}`, data)
      .then((res) => {
        if (res.data.success) {
          toast.success("Reset Password Success", { theme: "colored" });
          router.push("/auth/login");
        }
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <div className="w-full dark:bg-gray-800">
      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 w-full">
          <InputField
            type="email"
            placeholder="your@email.id"
            label="Email"
            className="w-full"
            {...register("email")}
            error={errors.email?.message}
            disabled
          />
        </div>
        <div className="mb-4 w-full">
          <InputField
            type="password"
            label="New Password"
            className="w-full"
            {...register("password")}
            error={errors.password?.message}
          />
        </div>
        <div className="mb-4 w-full">
          <InputField
            type="password"
            label="Confirm Password"
            className="w-full"
            {...register("password_confirmation")}
            error={errors.password_confirmation?.message}
          />
        </div>
        <div className="w-full my-4">
          <Button danger label="Reset Password" block bold />
        </div>
      </form>
    </div>
  );
};
export default ChangePassword;
