"use client";
import Link from "next/link";
import { useGlobalContext } from "@/context/GeneralContext";
import { useEffect } from "react";
export default function Home() {
  const { setToken, token } = useGlobalContext();

  async function fetchData() {
    try {
      const response = await fetch("/api/user/", {
        method: "GET",
      });
      const data = await response.json();
      if (response.status === 401 && data.error === "REDIRECT TO LOGIN") {
        console.log("redirect to login");
      }
      console.log(response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  fetchData();
  return <div></div>;
}
