import React from "react";

const CalendarHeader = () => {
  return (
    <header>
      <ul
        className={`first-letter: flex w-full border-b
      border-border-default py-1  pr-[18px] 
      last:border-r-0 [&>li]:pl-2 [&>li]:text-muted-dark
      ${showWeekend ? "[&>li]:w-[calc(100%/7)]" : `[&>li]:w-[calc(100%/5)]`}
      `}
        style={{
          paddingLeft: showWeekend ? 0 : hideWeekendDayWidth,
          paddingRight: showWeekend ? 0 : hideWeekendDayWidth,
        }}
      >
        {(showWeekend ? days : daysWithoutWeekend).map((day, index) => (
          <li
            className={`border- border-border-default text-xs font-medium ${
              index === days.length ? "" : ""
            } `}
            style={{
              width: `calc(100% - ${hideWeekendDayWidth * 2}px )`,
            }}
            key={index}
          >
            {day.toUpperCase()}
          </li>
        ))}
      </ul>
    </header>
  );
};

export default CalendarHeader;
