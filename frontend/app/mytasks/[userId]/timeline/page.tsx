"use client";
import Timeline from "@/components/tasks/timeline/Timeline";
import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";

const page = ({ params }: { params: { userId: string } }) => {
  const { userProject } = useGlobalContext();
  return <Timeline paramProjectId={params.userId} project={userProject} />;
};

export default page;
