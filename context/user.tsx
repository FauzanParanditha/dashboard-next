import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

type AuthStatus = "authenticated" | "unauthorized";

const userContext = () => {
  const { pathname } = useRouter();
  const [auth, setAuth] = useState<AuthStatus>("unauthorized");
  const [isDark, setIsDark] = useState(false);

  let url = null;
  if (pathname.startsWith("/__adm")) {
    url = "/adm/me";
  }

  const {
    isValidating,
    data: user,
    mutate,
    error,
  } = useSWR(url, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    refreshInterval: 20000,
  });

  //handle user authentication
  useEffect(() => {
    if (error) {
      if (error?.response?.status === 401) {
        setAuth("unauthorized");
      }
    } else if (user?.data) {
      setAuth("authenticated");
    } else if (!isValidating) {
      setAuth("unauthorized");
    }
  }, [isValidating, user, error]);

  //handle dark or light
  useEffect(() => {
    if (window.localStorage?.theme === "dark") {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      window.document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      window.document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return {
    user: user?.data || {},
    auth,
    revalidate: mutate,
    isDark,
    setIsDark,
  };
};

const UserContext = createContext({} as ReturnType<typeof userContext>);

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }: any) => {
  const value = userContext();
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
