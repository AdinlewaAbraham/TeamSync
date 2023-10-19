import { useGlobalContext } from "@/context/GeneralContext";
import { redirectToLogin } from "@/helpers/redirect";
import Task from "@/interfaces/task";
import React, { useEffect, useRef, useState } from "react";
import TaskBar from "./TaskBar";

const CalendarBox = ({
  date,
  projectId,
  highlight,
  index,
  taskWithDateRange,
  monthIndex,
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
}: {
  date: Date;
  projectId: string;
  highlight: boolean;
  index: number;
  taskWithDateRange: (string | Task | undefined)[];
  monthIndex: number;
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (c: number) => void;
  setCurrentYear: (c: number) => void;
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [showCheckMark, setShowCheckMark] = useState<boolean>(false);

  const { activeProject } = useGlobalContext();
  const boxRef = useRef(null);

  useEffect(() => {
    const calendarBoxScollParentElement = document.getElementById(
      "calendarBoxScollParent"
    );
    const handleScroll = () => {
      if (date.getDate() === 1) {
        const calendarBoxElement = boxRef.current as HTMLElement | null;
        if (calendarBoxScollParentElement && calendarBoxElement) {
          const parentRect =
            calendarBoxScollParentElement.getBoundingClientRect();
          const childRect = calendarBoxElement.getBoundingClientRect();

          const pxToTop = childRect.top - parentRect.top;

          if (pxToTop <= 96) {
            setCurrentMonth(date.getMonth());
            setCurrentYear(date.getFullYear());
          }
        }
      }
    };

    if (calendarBoxScollParentElement) {
      calendarBoxScollParentElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (calendarBoxScollParentElement) {
        calendarBoxScollParentElement.removeEventListener(
          "scroll",
          handleScroll
        );
      }
    };
  }, [date]);

  const addTask = async () => {
    setShowInput(false);

    if (!projectId || !taskName || !date) return;

    if (
      typeof activeProject?.sections[0] !== "object" ||
      !activeProject?.sections
    )
      return;
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 1);
    const postBody = {
      taskName,
      projectId,
      sectionId: activeProject.sections[0]._id,
      dateToStart: date,
      dueDate: dueDate,
    };
    const response = await fetch("/api/task/", {
      method: "POST",
      body: JSON.stringify(postBody),
    });
    setTaskName("");

    const data = await response.json();

    await redirectToLogin(response.status, data?.error);
    if (response.ok) {
      // update localtasks
    } else {
      console.log("something went wrong");
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const properlyIndexedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = new Date();

  const isToday =
    currentDate.getFullYear() === date.getFullYear() &&
    currentDate.getMonth() === date.getMonth() &&
    currentDate.getDate() === date.getDate();

  const newDate = new Date();

  const dateIndex = properlyIndexedDays.findIndex(
    (day) => days[date.getDay()] === day
  );

  const tasks = taskWithDateRange.filter((task) => {
    if (typeof task !== "object") return false;

    const taskDateToStart = new Date(task.dateToStart);
    if (taskDateToStart.toISOString() === date.toISOString()) {
      return true;
    }

    if (dateIndex === 0) {
      const taskStartDay = new Date(task.dateToStart);
      const taskDueDate = new Date(task.dueDate);

      return date > taskStartDay && date <= taskDueDate;
    }

    return false;
  });

  return (
    <div
      id={isToday ? "today" : index.toString()}
      className={` ${
        date.getDate() === 1 &&
        newDate.getMonth() === date.getMonth() &&
        newDate.getFullYear() === date.getFullYear() &&
        "currentMonthFirstDate"
      } relative border border-border-default border-b-0 h-48 cursor-cell w-full ${
        (index + 1) % 7 === 0 ? "border-r" : "border-r-0"
      } ${index % 7 !== 0 ? "border-l" : "border-l-0"} ${
        index <= 6 && monthIndex === 0 ? "border-t-0" : "border-t"
      } `}
      key={date.toString()}
      ref={boxRef}
      onClick={() => {
        setShowInput(true);
        console.log(tasks);
      }}
    >
      <div
        className={` max-w-max mb-1 p-4 h-7 flex justify-center items-center  ${
          !highlight && "text-muted-dark"
        } ${isToday && "bg-accent-blue rounded-lg"} `}
      >
        {date.getDate() === 1 && (
          <>{months[date.getMonth()].substring(0, 3)} </>
        )}
        {date.getDate()}
      </div>
      {tasks.map((task, index) => {
        if (typeof task !== "object") return;
        const isLast = tasks.length - 1 === index;
        return <TaskBar task={task} isLast={isLast} calendarIndex={index} calendarDate={date} />;
      })}
      {showInput && (
        <div className="px-2">
          <input
            className={`${
              tasks.length > 0 && "mt-1"
            } bg-transparent text-input w-full border-2 border-border-default text-sm focus:ring-0 flex items-center`}
            autoFocus
            onBlur={() => addTask()}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarBox;
