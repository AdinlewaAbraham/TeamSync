"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = ({ params }: { params: { projectId: string } }) => {
  const router = useRouter();
  useEffect(() => {
    router.push("/project/" + params.projectId + "/tasks/board");
  }, []);

  return <div>page</div>;
};

export default page;
