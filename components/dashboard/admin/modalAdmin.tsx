import React, { Fragment, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import InputField from "@/components/form/input";
import Button from "@/components/button";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import api, { handleAxiosError } from "@/api";
import useStore from "@/store";
import { HiOutlineX } from "react-icons/hi";
import { createAdminSchema } from "@/utils/schema/admin";

type Values = {
  fullName: string;
  email: string;
  password: string;
  password_confirmation?: string;
};

const ModalAdmin = ({ isOpen = false, setIsOpen, revalidate }: any) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    mode: "onBlur",
    resolver: yupResolver(createAdminSchema),
  });

  const { setIsLoading } = useStore();

  //create new data
  const onSubmit = (data: any) => {
    setIsLoading(true);
    api()
      .post("/adm/admin", data)
      .then((res) => {
        if (res.data.success) {
          revalidate({}, true);
          setIsOpen(false);
          toast.success("Create Users success", { theme: "colored" });
        }
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Transition as={Dialog} show={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left bg-white align-middle transition-all transform shadow-xl rounded-2xl dark:bg-slate-800">
            <DialogTitle
              as="h3"
              className="flex justify-between text-lg font-medium leading-6 py-2 text-gray-900 dark:text-white"
            >
              Create Admin
              <button
                type="button"
                className="bg-rose-50 rounded-full p-1 text-sm font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <HiOutlineX className="text-rose-600 h-5 w-5" />
              </button>
            </DialogTitle>
            <div className="border border-red-800 my-1"></div>
            <form method="post" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="mb-4 pr-2">
                  <InputField
                    className="w-full"
                    placeholder="ex: alfa"
                    label="Full Name"
                    {...register("fullName")}
                    error={errors.fullName?.message}
                  />
                </div>
                <div className="mb-4 pr-3">
                  <InputField
                    className="w-full"
                    placeholder="your@me.id"
                    label="Email"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="mb-4 pr-3">
                  <InputField
                    type="password"
                    className="w-full"
                    label="Password"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                </div>
                <div className="mb-4 pr-3">
                  <InputField
                    type="password"
                    className="w-full"
                    label="Password Confirmation"
                    {...register("password_confirmation")}
                    error={errors.password_confirmation?.message}
                  />
                </div>
              </div>
              <div className="my-2 w-1/2 md:w-1/4">
                <Button success label={"Create Data"} block bold />
              </div>
            </form>
          </div>
        </TransitionChild>
      </div>
    </Transition>
  );
};

export default ModalAdmin;
