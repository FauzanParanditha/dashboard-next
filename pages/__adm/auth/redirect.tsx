import useStore from "@/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectPage = () => {
  const router = useRouter();
  const { setIsLoading } = useStore();
  const { inquiry_id, reference_id } = router.query;

  useEffect(() => {
    setIsLoading(true);
    if (inquiry_id) {
      console.log("inquiry_id:", inquiry_id);
      console.log("reference_id:", reference_id);
      router.push("/auth/login");
      setIsLoading(false);
    }
  }, [inquiry_id, reference_id, router]);

  return <p>Redirecting...</p>;
};

export default RedirectPage;
