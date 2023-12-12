"use client"
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.back()}>done</button>
    </div>
  );
};

export default page;
