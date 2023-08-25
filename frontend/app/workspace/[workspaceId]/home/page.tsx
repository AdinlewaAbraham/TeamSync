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

  return (
    <>
      {activeWorkspace ? (
        <>loading</>
      ) : (
        <div>
          members {activeWorkspace?.members.length}
          <div>porjects</div>
          <div>
            about us
            {activeWorkspace?.description}
          </div>
        </div>
      )}
    </>
  );
};

export default page;
