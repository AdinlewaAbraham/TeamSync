"use client";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  return (
    <div className="flex-1 overflow-auto border pt-4">
      <button onClick={() => router.back()}>done</button>
    </div>
  );
};

export default page;
