"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminApiServices from "@/services/api/Admin.api.services";

export default function Protected({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (pathname === "/login") {
          setLoading(false);
          return;
        }

        const data = await AdminApiServices.getMyProfile();

        if (!data?.success) {
          router.replace("/login");
          return;
        }

        setLoading(false);
      } catch (error) {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return children;
}
