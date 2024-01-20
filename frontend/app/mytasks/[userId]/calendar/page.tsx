"use client";
import Calendar from "@/components/tasks/calendar/Calendar";
import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";

const page: React.FC<{
  params: { userId: string };
}> = ({ params }) => {
  const { userProject } = useGlobalContext();
  return <Calendar paramsProjectId={params.userId} project={userProject} />;
};

export default page;
