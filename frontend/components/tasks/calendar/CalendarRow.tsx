import React, { useEffect, useRef, useState } from "react";
import CalendarBox from "./CalendarBox";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import Task from "@/interfaces/task";
import Project from "@/interfaces/project";
const CalendarRow = ({
  project,
  dateArr,
  projectId,
  monthIndex,
  rowIndex,
  currentMonth,
  currentYear,
  taskWithDateRange,
  setCurrentMonth,
  setCurrentYear,
}: {
  project: Project | null;
  dateArr: Date[];
  projectId: string;
  monthIndex: number;
  rowIndex: number;
  taskWithDateRange: (string | Task | undefined)[];
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (c: number) => void;
  setCurrentYear: (c: number) => void;
}) => {
  const [rowTaskPositionObj, setRowTaskPositionObj] = useState<any>();
  const dateArrLastElementDate = new Date(dateArr[dateArr.length - 1]);
  const rowKey = `${dateArrLastElementDate.getFullYear()}${dateArrLastElementDate.getMonth()}${dateArrLastElementDate.getDate()}${rowIndex}  `;

  const rowWidthRef = useRef<HTMLElement | null>(null);
  const [rowWidth, setRowWidth] = useState(0);

  useEffect(() => {
    const rowWidthElement = rowWidthRef.current;

    if (rowWidthElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setRowWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(rowWidthElement);

      return () => {
        resizeObserver.unobserve(rowWidthElement);
      };
    }
  }, []);

  // useEffect(() => {
  //   localStorage.removeItem("localTaskPositionObject");
  // }, [taskWithDateRange]);

  return (
    <ul
      className="relative grid grid-flow-col grid-cols-7"
      // onClick={() => console.log(JSON.parse(localStorage.getItem(rowKey)))}
      key={rowKey}
    >
      <div
        className="absolute left-0 right-0 h-1 bg-transparent"
        ref={(element) => (rowWidthRef.current = element)}
      />
      {dateArr.map((date, index) => (
        <CalendarBox
          project={project}
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
          rowKey={rowKey}
          rowWidth={rowWidth}
        />
      ))}
    </ul>
  );
};

export default CalendarRow;
