"use client";
import AboutUs from "@/components/workspace/AboutUs";
import WorkspaceMembersComponent from "@/components/workspace/members/WorkspaceMembersComponent";
import WorkspaceProjectComponent from "@/components/workspace/projects/WorkspaceProjectComponent";
import { useGlobalContext } from "@/context/GeneralContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = ({ params }: { params: { workspaceId: string } }) => {
  const { activeWorkspace, user } = useGlobalContext();

  const router = useRouter();
  // categorySlug matches the filename [categorySlug].tsx
  useEffect(() => {
    if (user?.activeWorkspaceId === params.workspaceId) {
    }
  }, [user?.activeWorkspaceId]);

  return (
    <div className="absolute inset-0 flex h-auto min-h-0 flex-1 flex-grow justify-center gap-4 overflow-y-auto p-6">
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

export default Page;
