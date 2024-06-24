import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {
  GrInstagram,
  GrFacebookOption,
  GrTwitter,
  GrYoutube,
} from "react-icons/gr";
import Link from "next/link";

const Footer = () => {
  const [year, setYear] = useState<any>();
  useEffect(() => {
    const y = dayjs().year();
    setYear(y);
  }, []);

  return (
    <footer className="relative mt-10 bg-white dark:bg-gray-800">
      <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-16 md:p-8 lg:p-10">
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center mb-5 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              src="/favicon.ico"
              className="h-6 sm:h-9"
              alt="Landwind Logo"
            />
            <span className="text-sm text-slate-500 mt-1 ms-2">Apps</span>
          </Link>
          <span className="block text-sm text-center text-gray-400 dark:text-gray-400">
            © {year} Apps. All Rights Reserved.
          </span>
          <ul className="flex justify-center mt-5 space-x-5">
            <li>
              <a
                href="https://www.instagram.com"
                target="_blank"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
              >
                <GrInstagram className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com"
                target="_blank"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
              >
                <GrFacebookOption className="w-6 h-5 font-bold" />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
              >
                <GrTwitter className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com"
                target="_blank"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
              >
                <GrYoutube className="w-5 h-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
