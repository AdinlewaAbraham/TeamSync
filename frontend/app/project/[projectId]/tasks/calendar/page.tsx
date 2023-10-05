"use client";
import CalendarBox from "@/components/project/calendar/CalendarBox";
import React from "react";

const page = ({ params }: { params: { projectId: string } }) => {
  function generateDates(year: number, month: number) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const dates = [];

    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date)); // Clone the date to avoid mutations
    }

    return dates;
  }

  // Example usage:
  const year = 2023;
  const month = 8; // 8 represents September (0-indexed)
  const dates = generateDates(year, month);

  // console.log(dates);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div>
      <header>
        <ul className="flex w-full [&>li]:w-[calc(100%/7)]">
          {days.map((day) => (
            <li key={day}>{day}</li>
          ))}
        </ul>
      </header>
      <div className="grid grid-flow-row grid-cols-7  pr-2 overflow-y-auto h-[calc(100dvh-229px)] scrollBar">
        {dates.map((date) => (
          <CalendarBox
            date={JSON.stringify(date)}
            projectId={params.projectId}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
