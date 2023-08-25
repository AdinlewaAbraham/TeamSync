"use client";
import MainLayout from "@/components/MainLayout";
import React, { useEffect } from "react";
import Link from "next/link";
import { useGlobalContext } from "@/context/GeneralContext";
import User from "@/interfaces/user";
import LoadingComponent from "@/components/LoadingComponent";
import fetchUser from "@/helpers/fetchUser";
import {  useRouter } from "next/router";

const page = () => {
  const { user, setUser } = useGlobalContext();
  // const router = useRouter();

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
    // router.push("/workspace/" + user?.activeWorkspaceId + "home");
  }, []);

  return <LoadingComponent />;
};

export default page;
