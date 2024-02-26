import React, {
  MouseEvent,
  useEffect,
  useRef,
  useState,
  DragEvent,
  useMemo,
  useCallback,
} from "react";
import { useGlobalContext } from "@/context/GeneralContext";
import Task from "@/interfaces/task";
import CalendarTaskBar from "./CalendarTaskBar";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import findMinFreeRowNumber from "@/utilis/findMinFreeRowNumber";
import Section from "@/interfaces/section";
import Project from "@/interfaces/project";
import { fetchAndHelpRedirect } from "@/helpers/redirect";
import CalendarRowTaskPositionObject from "@/interfaces/calendarRowTaskPositionObject";
import {
  days,
  hideWeekendDayWidth,
  months,
  properlyIndexedDays,
} from "@/constants/calendar";
import { InputTaskPropObject, useCalendarStore } from "@/store/calendarStore";
import { calculateTop } from "@/utilis/calculateTop";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import { isSameDay } from "@/utilis/isSameDay";
import doDateFallWithinTimeframe from "@/utilis/doDateFallWithinTimeframe";
import CalendarBoxInput from "./CalendarBoxInput";
import { Timeframe } from "@/interfaces/timeframe";

type Props = {
  project: Project | null;
  calendarBoxDate: Date;
  projectId: string;
  highlight: boolean;
  monthIndex: number;
  rowIndex: number;
  tasksInRow: (Task | InputTaskPropObject)[];
  rowKey: string;
  rowWidth: number;
  calendarRowTaskPositionObject: CalendarRowTaskPositionObject;
  rowTimeframe: Timeframe;
};
const CalendarBox: React.FC<Props> = ({
  project,
  calendarBoxDate,
  projectId,
  highlight,
  monthIndex,
  rowIndex,
  tasksInRow,
  rowKey,
  rowWidth,
  calendarRowTaskPositionObject,
  rowTimeframe,
}) => {
  const {
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,
    showWeekend,
    newTaskDuration,
    setTaskWithDateRange,
    taskWithDateRange,
  } = useCalendarStore();

  const [taskName, setTaskName] = useState<string>("");

  const boxRef = useRef(null);

  useEffect(() => {
    const calendarBoxScollParentElement = document.getElementById(
      "calendarBoxScollParent",
    );

    // const handleScroll = () => {
    //   if (date.getDate() === 1) {
    //     const calendarBoxElement = boxRef.current as HTMLElement | null;
    //     if (calendarBoxScollParentElement && calendarBoxElement) {
    //       const parentRect =
    //         calendarBoxScollParentElement.getBoundingClientRect();
    //       const childRect = calendarBoxElement.getBoundingClientRect();
    //       const pxToTop = childRect.top - parentRect.top;
    //       if (pxToTop <= 96) {
    //         setCurrentMonth(date.getMonth());
    //         setCurrentYear(date.getFullYear());
    //       }
    //     }
    //   }
    // };

    // if (calendarBoxScollParentElement) {
    //   calendarBoxScollParentElement.addEventListener("scroll", handleScroll);
    // }

    // return () => {
    //   if (calendarBoxScollParentElement) {
    //     calendarBoxScollParentElement.removeEventListener(
    //       "scroll",
    //       handleScroll,
    //     );
    //   }
    // };
  }, [calendarBoxDate, setCurrentMonth, setCurrentMonth, boxRef]);

  const newTaskDueDate = new Date(calendarBoxDate);
  newTaskDueDate.setDate(newTaskDueDate.getDate() + (newTaskDuration - 1));

  const currentDate = new Date();

  const isToday = isSameDay(currentDate, calendarBoxDate);

  const newDate = new Date();

  const dateIndex = properlyIndexedDays.findIndex(
    (day) => days[calendarBoxDate.getDay()] === day,
  );

  const tasksThatStartOnDay = useMemo(
    () =>
      tasksInRow.filter((task) => {
        if (typeof task !== "object") return false;

        const taskDateToStart = new Date(task.dateToStart);
        if (isSameDay(taskDateToStart, calendarBoxDate)) {
          return true;
        }

        if (dateIndex === 0) {
          const taskStartDay = new Date(task.dateToStart);
          const taskDueDate = new Date(task.dueDate);

          return (
            calendarBoxDate > taskStartDay && calendarBoxDate <= taskDueDate
          );
        }

        return false;
      }),
    [tasksInRow],
  ) as Task[];

  const handleCalendarClick = (e: MouseEvent) => {
    const clickTarget = e.target as HTMLElement;
    if (
      clickTarget.closest(".taskBar") ||
      clickTarget.closest(".taskBarInput")
    ) {
      console.log("you just clicked on taskbar");
    } else {
      setTaskWithDateRange([
        ...taskWithDateRange,
        { _id: "input", dueDate: newTaskDueDate, dateToStart: calendarBoxDate },
      ]);
      // setCalendarInputBoxObject({
      //   dueDate: newTaskDueDate,
      //   startDate: calendarBoxDate,
      //   taskName: "",
      // });
    }
  };

  const allowDrop = (e: DragEvent) => {
    if (e) e.preventDefault();
    // stuff that hanldes effects hover drop effect in calendaBox like adding _blank to component
    console.log("i should be calculating and sorting and appending stuff");
  };

  const drop = (e: DragEvent) => {
    e.preventDefault();
    console.log(e.target);
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain");
      console.log(data);
    }
    console.log("i tried to drop");
  };

  const dragLeave = () => {
    console.log("i should be doing clean p");
  };

  const dayStringName = properlyIndexedDays[calendarBoxDate.getDay()];

  const isFirstDayInDaysArr =
    dayStringName.toLowerCase().substring(0, 3) ===
    days[0].toLowerCase().substring(0, 3);

  const isWeekend =
    calendarBoxDate.getDay() === 0 || calendarBoxDate.getDay() === 6;
  const hideWeekendBox = isWeekend && !showWeekend;

  const boxWidth =
    rowWidth === 0
      ? 0
      : !showWeekend
        ? (rowWidth - hideWeekendDayWidth * 2) / (days.length - 2)
        : rowWidth / 7;

  console.log("i rendered");
  return (
    <li
      id={
        calendarBoxDate.getDate() +
        `${calendarBoxDate.getMonth()}` +
        calendarBoxDate.getFullYear()
      }
      className={`relative box-border h-48 cursor-cell border border-b-0 border-border-default
      ${
        calendarBoxDate.getDate() === 1 &&
        newDate.getMonth() === calendarBoxDate.getMonth() &&
        newDate.getFullYear() === calendarBoxDate.getFullYear() &&
        "currentMonthFirstDate"
      } 
      ${isToday && "today"}  
      ${!isFirstDayInDaysArr && "border-l"} 
      ${monthIndex === 0 && rowIndex === 0 ? "border-t-0" : "border-t"}
      border-0 `}
      ref={boxRef}
      onClick={handleCalendarClick}
      onDragOver={allowDrop}
      onDrop={drop}
      onDragLeave={dragLeave}
      style={{
        width: hideWeekendBox ? hideWeekendDayWidth : "100%",
        minWidth: hideWeekendDayWidth,
      }}
    >
      <div
        className={`m-2 flex h-7 max-w-max items-center justify-center p-2 ${
          !highlight && "text-muted-dark"
        } ${isToday && "rounded-lg bg-accent-blue"} `}
      >
        {calendarBoxDate.getDate() === 1 && (
          <>{months[calendarBoxDate.getMonth()]} </>
        )}
        {calendarBoxDate.getDate()}
      </div>
      <div className="relative">
        {tasksThatStartOnDay
          // .sort((a, b) => a?.taskName?.localeCompare(b?.taskName))
          .map((task, index) => {
            if (typeof task !== "object") return;
            const isLast = tasksThatStartOnDay.length - 1 === index;
            return (
              <CalendarTaskBar
                index={index}
                task={task}
                isLast={isLast}
                calendarBoxDate={calendarBoxDate}
                boxWidth={boxWidth}
                key={task._id}
                calendarRowTaskPositionObject={calendarRowTaskPositionObject}
                tasksInRow={tasksInRow}
                projectId={projectId}
                project={project}
                rowTimeframe={rowTimeframe}
              />
            );
          })}
      </div>
    </li>
  );
};

export default CalendarBox;
