"use client";
import MainLayout from "@/components/MainLayout";
import React, { useEffect } from "react";
import Link from "next/link";
import { useGlobalContext } from "@/context/GeneralContext";
import User from "@/interfaces/user";

const page = () => {
  const { user, setUser } = useGlobalContext();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user) {
      setUser(user);
    } else {
    }
  }, []);

  return <main>redirect to last workspace home page</main>;
};

export default page;
