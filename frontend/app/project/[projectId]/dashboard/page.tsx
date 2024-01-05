"use client";
import DashboardWidgetsComponent from "@/components/dashboard/widgets/DashboardWidgetsComponent";
import generateDates from "@/utilis/generateDates";
import React from "react";
const months = generateDates(2023, 8);
const page = () => {
  return (
    <div className="relative flex-1 ">
      <div className="absolute inset-0 overflow-auto">
        <DashboardWidgetsComponent />
      </div>
    </div>
  );
};

export default page;
