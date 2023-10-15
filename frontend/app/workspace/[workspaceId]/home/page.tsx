"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = ({ params }: { params: { workspaceId: string } }) => {
  const { activeWorkspace, user } = useGlobalContext();

  const router = useRouter();
  // categorySlug matches the filename [categorySlug].tsx
  useEffect(() => {
    if (user?.activeWorkspaceId === params.workspaceId) {
    }
  }, [user?.activeWorkspaceId]);


  return <div>{params.workspaceId} add notion like text editior to this </div>;
};

export default page;
