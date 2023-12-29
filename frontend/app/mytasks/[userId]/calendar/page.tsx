"use client";
import Calendar from "@/components/tasks/calendar/Calendar";
import React from "react";

const page = ({ params }: { params: { userId: string } }) => {
  return <Calendar paramsProjectId={params.userId} />;
};

export default page;
