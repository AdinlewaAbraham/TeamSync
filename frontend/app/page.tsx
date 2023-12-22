"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import { useEffect } from "react";
import { redirectToLogin } from "@/helpers/redirect";

import { useRouter } from "next/navigation";
import fetchUser from "@/helpers/user/fetchUser";
export default function Home() {
  const { setUser, user } = useGlobalContext();
  useEffect(() => {
    const handleUser = async () => {
      try {
        const user = await fetchUser();
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          window.location.href = "/home";
        }
      } catch (error) {
        console.error(error);
      }
    };
    handleUser();
  }, []);

  return <div>validationg user...</div>;
}
