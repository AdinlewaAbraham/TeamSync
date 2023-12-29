"use client";
import Table from "@/components/tasks/table/Table";
import React from "react";

const page = ({ params }: { params: { userId: string } }) => {
  return <Table paramsProjectId={params.userId} />;
};

export default page;
