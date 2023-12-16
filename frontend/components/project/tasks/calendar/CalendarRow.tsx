import React, { useEffect, useState } from "react";
import CalendarBox from "./CalendarBox";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import Task from "@/interfaces/task";
const CalendarRow = ({
  dateArr,
  projectId,
  monthIndex,
  rowIndex,
  currentMonth,
  currentYear,
  taskWithDateRange,
  setCurrentMonth,
  setCurrentYear,
  taskHoverStatusObj,
  setTaskHoverStatusObj,
}: {
  dateArr: Date[];
  projectId: string;
  monthIndex: number;
  rowIndex: number;
  taskWithDateRange: (string | Task | undefined)[];
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (c: number) => void;
  setCurrentYear: (c: number) => void;
  taskHoverStatusObj: TaskHoverStatusObj;
  setTaskHoverStatusObj: (c: TaskHoverStatusObj) => void;
}) => {
  const [rowTaskPositionObj, setRowTaskPositionObj] = useState<any>();
  const dateArrLastElementDate = new Date(dateArr[dateArr.length - 1]);
  const rowKey = `${dateArrLastElementDate.getFullYear()}${dateArrLastElementDate.getMonth()}${dateArrLastElementDate.getDate()}${rowIndex}  `;
 

  return (
    <ul
      className="grid grid-flow-col  grid-cols-[7]"
      // onClick={() => console.log(JSON.parse(localStorage.getItem(rowKey)))}
      key={rowKey}
    >
      {dateArr.map((date, index) => (
        <CalendarBox
          date={new Date(date)}
          projectId={projectId}
          highlight={
            new Date(date).getMonth() === currentMonth &&
            new Date(date).getFullYear() === currentYear
          }
          monthIndex={monthIndex}
          rowIndex={rowIndex}
          index={index}
          taskWithDateRange={taskWithDateRange}
          key={index + new Date(date).getMonth()}
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
          taskHoverStatusObj={taskHoverStatusObj}
          setTaskHoverStatusObj={setTaskHoverStatusObj}
          rowKey={rowKey}
        />
      ))}
    </ul>
  );
};

export default CalendarRow;
