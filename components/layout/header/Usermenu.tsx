import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { classNames } from "@/utils/helpers";
import { FaChevronDown } from "react-icons/fa6";
import { FcBusinessman } from "react-icons/fc";
import { useRouter } from "next/router";
import { jwtConfig } from "@/utils/var";
import { deleteCookie } from "cookies-next";
import { useUserContext } from "@/context/user";
import useStore from "@/store";
import api, { handleAxiosError } from "@/api";
import { ObjectId } from "mongodb";

const UserMenu = () => {
  const { user, revalidate } = useUserContext();
  const { setIsLoading } = useStore();
  const router = useRouter();
  const { pathname, push } = useRouter();
  let tokenName = jwtConfig.accessTokenName;
  let refreshName = jwtConfig.refreshTokenName;
  if (pathname.startsWith("/__adm")) {
    tokenName = jwtConfig.accessAdminTokenName;
    refreshName = jwtConfig.refreshAdminTokenName;
  }

  const profile = () => {
    if (pathname.startsWith("/__adm")) {
      push("/dashboard/profile");
    } else {
      push("/user/profile");
    }
  };

  const logout = () => {
    setIsLoading(true);
    api()
      .get("/adm/me")
      .then((res) => {
        if (res.status == 200) {
          const email: ObjectId = res.data.data.email;
          api()
            .post("/adm/auth/logout", { email })
            .then((res) => {
              if (res.data.success) {
                deleteCookie(tokenName);
                deleteCookie(refreshName);
                revalidate({}, true);
              }
            });
        }
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setIsLoading(false);
        router.push("/auth/login");
      });
  };

  const userNavigation = [
    { name: "Your profile", href: profile },
    { name: "Sign out", href: logout },
  ];
  return (
    <div className="">
      {/* Profile dropdown */}
      <Menu as="div" className="relative">
        <MenuButton className="-m-1.5 flex items-center p-1.5">
          <span className="sr-only">Open user menu</span>
          <p className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <FcBusinessman className="h-6 w-6" />
          </p>
          <span className="hidden lg:flex lg:items-center">
            <span
              className="ml-4 text-sm font-semibold leading-6 text-gray-900"
              aria-hidden="true"
            >
              {user?.fullName}
            </span>
            <FaChevronDown
              className="ml-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </MenuButton>
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            {userNavigation.map((item) => (
              <MenuItem key={item.name}>
                {({ focus }) => (
                  <a
                    href="#"
                    onClick={item.href}
                    className={classNames(
                      focus ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900"
                    )}
                  >
                    {item.name}
                  </a>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default UserMenu;
