"use client";
import Table from "@/components/tasks/table/Table";
import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";

const page = ({ params }: { params: { userId: string } }) => {
  const { userProject } = useGlobalContext();
  return <Table paramsProjectId={params.userId} project={userProject} />;
};

export default page;
