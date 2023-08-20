"use sever";
import MainLayout from "@/components/MainLayout";
import React from "react";
import Link from "next/link";

const page = () => {
  async function fetchData() {
    try {
      const response = await fetch("/user", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  fetchData();

 

  return (
    <>
      home page <Link href={"/login"}> redirect to login page</Link>{" "}
    </>
  );
};

export default page;
