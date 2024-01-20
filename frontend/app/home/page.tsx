"use client";
import MainLayout from "@/components/others/MainLayout";
import React, { useEffect } from "react";
import Link from "next/link";
import { useGlobalContext } from "@/context/GeneralContext";
import User from "@/interfaces/user";
import LoadingComponent from "@/components/others/LoadingComponent";
import fetchUser from "@/helpers/user/fetchUser";
import { useRouter } from "next/navigation";

const page: React.FC = () => {
  const { user, setUser } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const userString = localStorage.getItem("user");
      const user: User | null = userString ? JSON.parse(userString) : null;
      if (user) {
        setUser(user);
      } else {
        const user = await fetchUser();
        setUser(user);
      }
    };
    getUser();
  }, []);
  useEffect(() => {
    if (user) {
      router.push("/workspace/" + user?.activeWorkspaceId + "/home");
    }
  }, [user]);

  return <>this page is not used again</>;
};

export default page;
