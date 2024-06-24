import { clsx } from "clsx";
import {
  forwardRef,
  ForwardRefExoticComponent,
  InputHTMLAttributes,
  ReactNode,
  useState,
  useEffect,
} from "react";

import {
  HiSearch,
  HiOutlineEye,
  HiCheck,
  HiLockClosed,
  HiX,
} from "react-icons/hi";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  classLabel?: string;
  type?: string;
  error?: string;
  info?: string | ReactNode;
  infoType?: "info" | "danger" | "primary" | "success";
  filename?: string;
  checked?: boolean;
  handleClick?: () => void;
  value?: any;
}

const Input: ForwardRefExoticComponent<Props> = forwardRef<
  HTMLInputElement,
  Props
>(
  (
    {
      value,
      type = "text",
      error,
      label,
      className,
      classLabel,
      info,
      infoType = "info",
      filename = "",
      checked,
      handleClick,
      ...rest
    },
    ref: any
  ) => {
    const { name, required } = rest;
    const [isShow, setShow] = useState(false);
    const [isValid, setValid] = useState(false);

    function togglePassword(e: any) {
      e.preventDefault();
      const target = e.currentTarget;
      if (target) {
        const input = target.previousSibling;
        if (input.type === "password") {
          input.type = "text";
          setShow(true);
        } else {
          input.type = "password";
          setShow(false);
        }
      }
    }
    const handleBlur = (e: any) => {
      if (e.target.validity.valid) {
        setValid(true);
      } else {
        setValid(false);
      }
    };
    // useEffect(() => {
    //   if(value !== undefined){
    //     setValid(true)
    //   }
    // }, [value]);

    return (
      <div className="space-y-2">
        {label && (
          <label
            className={clsx(
              classLabel,
              "text-sm text-slate-500 dark:text-slate-200"
            )}
            htmlFor={name}
          >
            {label}
            {required && <span className="text-xs text-red-800">*</span>}
          </label>
        )}
        <div className="flex flex-row w-full relative">
          <input
            id={name}
            name={name}
            ref={ref}
            className={clsx(
              className,
              "block px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm",
              "placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
              "disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-blue-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500",
              {
                ["rounded-l-md h-10"]: type === "password" || type === "search",
                ["rounded-md"]:
                  type === "text" || type === "email" || type === "number",
                ["hidden"]: type === "file",
              }
            )}
            type={type}
            onInput={handleBlur}
            onChange={handleBlur}
            {...rest}
          />

          {type === "file" && (
            <div className="grow rounded-l-md border border-gray-300 p-2 outline-none w-full truncate">
              <p className="truncate dark:text-white">
                {filename ? filename : "Pilih file.."}
              </p>
            </div>
          )}

          {type === "password" && (
            <button
              type="button"
              className="inline-flex items-center h-10 p-2 px-3 border border-red-800 border-l-transparent bg-red-800 hover:bg-red-900 rounded-r-md"
              onClick={togglePassword}
            >
              <span className="text-slate-100 h-6 w-6 flex items-center justify-center">
                {isShow ? <HiOutlineEye /> : <HiLockClosed />}
              </span>
            </button>
          )}
          {type === "search" && (
            <button
              type="button"
              className={clsx(
                "inline-flex items-center px-3 py-2 text-sm text-slate-200 bg-red-800 hover:bg-red-900 hover:text-slate-50 rounded-r-md border border-r-0 border-red-800 dark:text-slate-200"
              )}
              onClick={handleClick}
            >
              <div className="">
                <HiSearch />
              </div>
            </button>
          )}
          {type == "file" && (
            <label
              className="cursor-pointer  select-none flex items-center p-2 px-3 border border-slate-700 border-l-transparent bg-slate-700 hover:bg-slate-900 rounded-r-md"
              htmlFor={name}
            >
              browse
            </label>
          )}
          {error &&
            type !== "number" &&
            type !== "password" &&
            type !== "file" &&
            type !== "search" && (
              <span
                className={clsx(
                  "h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 none",
                  {
                    ["text-green-400"]: isValid,
                    ["text-red-600"]: !isValid,
                  }
                )}
              >
                {isValid ? <HiCheck /> : <HiX />}
              </span>
            )}
        </div>
        {!error && info && (
          <p
            className={clsx("text-xs inline-block", {
              ["text-red-800"]: infoType === "danger",
              ["text-emerald-700"]: infoType === "success",
              ["text-blue-700"]: infoType === "primary",
              ["text-slate-400"]: infoType === "info",
            })}
          >
            {info}
          </p>
        )}
        {error && (
          <span className="text-xs inline-block text-red-800">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
