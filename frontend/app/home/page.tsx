"use client";
import MainLayout from "@/components/MainLayout";
import React, { useEffect } from "react";
import Link from "next/link";

const page = () => {
  return (
    <>
      home page <Link href={"/login"}> redirect to login page</Link>{" "}
    </>
  );
};

export default page;
