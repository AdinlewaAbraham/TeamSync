"use client";
import Board from "@/components/tasks/board/Board";
import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";

const Page: React.FC<{
  params: { userId: string };
}> = ({ params }) => {
  console.log(params.userId);
  const { userProject } = useGlobalContext();
  return <Board paramsProjectId={params.userId} project={userProject} />;
};

export default Page;
