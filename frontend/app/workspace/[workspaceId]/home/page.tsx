"use client";
import AboutUs from "@/components/workspace/AboutUs";
import WorkspaceMembersComponent from "@/components/workspace/members/WorkspaceMembersComponent";
import WorkspaceProjectComponent from "@/components/workspace/projects/WorkspaceProjectComponent";
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

  return (
    <div className="absolute inset-0 h-auto overflow-y-auto flex flex-1 justify-center gap-4 p-6 min-h-0 flex-grow">
      <div className="flex w-[70%] max-w-[600px] flex-col gap-4">
        <WorkspaceMembersComponent />
        <WorkspaceProjectComponent />
      </div>
      <div className="w-[30%] max-w-[320px]">
        <AboutUs />
      </div>
    </div>
  );
};

export default page;
