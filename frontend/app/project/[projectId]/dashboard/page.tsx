import generateDates from "@/utilis/generateDates";
import React from "react";
const months = generateDates(2023, 8);
const page = () => {
  return (
    <div className="">
      project reports with charts and all
      <div className=" timeline_col">
        {/* {months.map((month) => (
          <div className="w-5 h-5 border border-border-default"></div>
        ))} */}
      </div>
      <div className="calendar-grid">
        <div className="day">1</div>
        <div className="day">2</div>

        <div className="time-slot">8:00 AM</div>
        <div className="time-slot">9:00 AM</div>
      </div>
    </div>
  );
};

export default page;
