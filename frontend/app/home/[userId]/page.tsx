"use client";
import UserHomePageHeaderComponent from "@/components/user/home/UserHomePageHeaderComponent";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { userId } = useParams();

  if (!userId) return <div>loading...</div>;
  return (
    <div className=" flex flex-1 flex-col items-center px-6">
      <div className="max-w-6xl w-full">
        <UserHomePageHeaderComponent
          userId={typeof userId === "object" ? userId[0] : userId}
        />
      </div>
    </div>
  );
};

export default page;
