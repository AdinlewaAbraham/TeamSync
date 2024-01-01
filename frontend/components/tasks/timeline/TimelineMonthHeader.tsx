import React from "react";

const TimelineMonthHeader = ({
  month,
  selectedDateObject,
}: {
  month: { name: string; year: number; dates: Date[] };
  selectedDateObject: {
    startDate: Date;
    endDate: Date;
  } | null;
}) => {
  return (
    <div className="flex flex-col" key={month.name + month.year + "header"}>
      <div className="sticky left-0 max-w-max px-2 ">
        {month.name} {month.year}
      </div>
      <div className="flex">
        {month.dates.map((day, index) => {
          console.log(selectedDateObject);
          const highlightDate =
            selectedDateObject &&
            new Date(day) >= new Date(selectedDateObject?.startDate) &&
            new Date(day) <= new Date(selectedDateObject?.endDate);

          return (
            <div
              key={index}
              className={`w-[40px]
         ${
           (day.getDay() === 0 || day.getDay() === 6) &&
           !highlightDate &&
           "bg-bg-primary"
         } ${
           highlightDate && "bg-accent-blue"
         } flex items-center justify-center `}
              onClick={() => console.log(day)}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineMonthHeader;
