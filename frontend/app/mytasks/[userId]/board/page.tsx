"use client";
import Board from "@/components/tasks/board/Board";
import React from "react";

const page = ({ params }: { params: { userId: string } }) => {
  console.log(params.userId);
  return <Board paramsProjectId={params.userId} />;
};

export default page;
