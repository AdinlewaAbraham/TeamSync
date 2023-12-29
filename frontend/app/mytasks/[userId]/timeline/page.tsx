"use client";
import Timeline from "@/components/tasks/timeline/Timeline";
import React from "react";

const page = ({ params }: { params: { userId: string } }) => {
  return <Timeline paramProjectId={params.userId} />;
};

export default page;
