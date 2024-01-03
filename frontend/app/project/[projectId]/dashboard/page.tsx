"use client";
import DashboardWidgetsComponent from "@/components/dashboard/widgets/DashboardWidgetsComponent";
import generateDates from "@/utilis/generateDates";
import React from "react";
const months = generateDates(2023, 8);
const page = () => {
  return (
    <div className="flex max-w-6xl flex-1 justify-center px-10">
      <DashboardWidgetsComponent />
    </div>
  );
};

export default page;
