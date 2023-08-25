"use client";
import LoadingComponent from "@/components/LoadingComponent";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchUser from "@/helpers/fetchUser";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const { user, setUser } = useGlobalContext();
  const router = useRouter();
  useEffect(() => {
    const handleRedirect = async() => {
      if (!user) {
        const userData = await fetchUser();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
      router.push("/workspace/" + user?.activeWorkspaceId + "/home");
    };
    handleRedirect();
  }, [user]);

  return <LoadingComponent />;
};

export default page;
