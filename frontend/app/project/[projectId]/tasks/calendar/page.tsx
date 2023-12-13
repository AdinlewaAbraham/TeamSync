"use client";
import CalendarBox from "@/components/project/calendar/CalendarBox";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useRef, useState } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Project from "@/interfaces/project";
import generateDates from "@/utilis/generateDates";
import generateDatesForFourMonths from "@/utilis/generateDatesForFourMonths";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import findMinFreeRowNumber from "@/utilis/findMinFreeRowNumber";
import Task from "@/interfaces/task";
import CalendarRow from "@/components/project/calendar/CalendarRow";

const page = ({ params }: { params: { projectId: string } }) => {
  const currentDate = new Date();
  const cM = currentDate.getMonth();
  const cY = currentDate.getFullYear();

  const { activeProject, setActiveProject } = useGlobalContext();

  const [currentMonth, setCurrentMonth] = useState<number>(cM);
  const [monthsDates, setmonthsDates] = useState(
    generateDatesForFourMonths(cY, cM),
  );

  const [taskHoverStatusObj, setTaskHoverStatusObj] =
    useState<TaskHoverStatusObj>({ shutUpTs: true });
  const [currentYear, setCurrentYear] = useState<number>(cY);
  const [color, setcolor] = useState("no-color");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const properlyIndexedDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getPrevMonthDays = (month: number, year: number) => {
    if (month === 0) {
      return generateDates(year - 1, 11);
    } else {
      return generateDates(year, month - 1);
    }
  };
  const getNextMonthDays = (month: number, year: number) => {
    if (month === 11) {
      return generateDates(year + 1, 0);
    } else {
      return generateDates(year, month + 1);
    }
  };
  let lastDayPushed: Date | null;
  const filledMonthsDates = monthsDates.map((month) => {
    const dates: Date[] = JSON.parse(JSON.stringify(month.dates));

    const firstDayInDates = new Date(dates[0]);
    const firstDay = properlyIndexedDays[firstDayInDates.getDay()];
    const noOfDaysToUnshift = days.indexOf(firstDay);
    const prevMonthDays = getPrevMonthDays(
      firstDayInDates.getMonth(),
      firstDayInDates.getFullYear(),
    );
    let daysToUnshit;
    if (lastDayPushed) {
      const currentDate = new Date(lastDayPushed);
      const daysToUnshiftHolderArr = [];
      for (let i = 0; i < noOfDaysToUnshift; i++) {
        // this is meant to be the prev month
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        daysToUnshiftHolderArr.push(newDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      daysToUnshit = daysToUnshiftHolderArr;
      if (daysToUnshit.length !== 0) {
        // remove unwanted begining dates
        const lastdayInDaysToUnshit = new Date(
          daysToUnshit[daysToUnshit.length - 1],
        );
        dates.splice(0, lastdayInDaysToUnshit.getDate());
      }
    } else {
      daysToUnshit = prevMonthDays.slice(-noOfDaysToUnshift);
    }
    dates.unshift(...daysToUnshit);

    const noOfDaysToPush = 7 - (dates.length % 7);
    if (dates.length % 7 !== 0) {
      const nextMonthDays = getNextMonthDays(
        firstDayInDates.getMonth(),
        firstDayInDates.getFullYear(),
      );
      const daysToFill = nextMonthDays.slice(0, noOfDaysToPush);
      dates.push(...daysToFill);
      lastDayPushed = daysToFill[daysToFill.length - 1];
      if (daysToFill.length === 0) {
        lastDayPushed = null;
      }
    }
    const batchSize = 7;
    const dateBatches = [];

    for (let i = 0; i < dates.length; i += batchSize) {
      dateBatches.push(dates.slice(i, i + batchSize));
    }

    return { ...month, dates: dateBatches };
  });
  const [havescrolled, setHavescrolled] = useState(false);
  useEffect(() => {
    // if (filledMonthsDates.length > 0){

    // }
    const scrollToElement = document.getElementsByClassName(
      "currentMonthFirstDate",
    );

    if (scrollToElement[0] && !havescrolled) {
      scrollToElement[0].scrollIntoView();
      setHavescrolled(true);
    }
  }, [filledMonthsDates]);

  useEffect(() => {
    const fetchProjectFunc = async () => {
      const response = await fetchProject(params.projectId);
      if (!response) {
      } else {
        const { data, status } = response;
        await redirectToLogin(status, data?.error);
        // console.log(data);
        setActiveProject(data);
        localStorage.setItem(params.projectId, JSON.stringify(data));
      }
    };
    const getProject = async () => {
      if (activeProject) return;
      const stringData = localStorage.getItem(params.projectId);
      const project: Project = stringData ? JSON.parse(stringData) : undefined;

      if (project?._id) {
        setActiveProject(project);
      } else {
        await fetchProjectFunc();
      }
    };
    const syncProject = async () => {
      if (activeProject?._id) {
        await fetchProjectFunc();
      }
    };
    const resolveFuncSync = async () => {
      await Promise.all([getProject(), syncProject()]);
    };
    resolveFuncSync();
  }, []);

  const calendarBoxScollParent = useRef(null);

  useEffect(() => {
    const targetElement = calendarBoxScollParent.current;

    if (!targetElement) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
      }
    });

    resizeObserver.observe(targetElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [calendarBoxScollParent]);

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
  const handleAddMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const handleDecreaseMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  if (!activeProject?.sections) return <>loading state</>;

  const allTasks = activeProject.sections
    .map((section) => {
      if (typeof section === "string") return;
      return section.tasks;
    })
    .flat(1);
  const taskWithDateRange = allTasks.filter((task) => {
    if (typeof task !== "object") return;
    return task?.dateToStart && task.dueDate;
  });
  if (
    Array.isArray(taskWithDateRange) &&
    taskWithDateRange.every((item) => typeof item === "object")
  ) {
    const taskArray: Task[] = taskWithDateRange as Task[];
    // const rowNumber = findMinFreeRowNumber(
    //   taskArray,
    //   new Date("2023-10-02T23:00:00.000Z"),
    //   new Date("2023-10-11T23:00:00.000Z")
    // );
  }

  //   const allTaskThatFallsWithinTimeFrame = allTasks.filter((task) => {
  //     const dateToStart = new Date(task.dateToStart)
  //     const dueDate = new Date(task.dueDate)
  //     return dateToStart >= taskDateToStart && dueDate <= taskDueDate;
  //   });
  // console.log(allTaskThatFallsWithinTimeFrame)

  // if the starts with that day it will have a p to the right
  //  if the task ends it will have a padding to the right
  //  if it does not start or end with that day it has no padding

  return (
    <div className="flex flex-1 select-none flex-col">
      <nav className="flex items-center justify-between border-t border-border-default py-2 text-sm">
        <div
          className="flex items-center text-muted-dark 
           [&>i]:flex [&>i]:h-9 [&>i]:w-7
       [&>i]:cursor-pointer [&>i]:items-center [&>i]:justify-center  [&>i]:rounded-lg  [&>i]:text-lg 
       [&>i]:text-muted-dark [&>i]:transition-colors [&>i]:duration-150  hover:[&>i]:bg-menuItem-active hover:[&>i]:text-white   "
        >
          <button
            className="flex h-9 items-center justify-center rounded-lg border border-border-default px-2
        hover:border-white hover:bg-menuItem-hover hover:text-white"
            onClick={() => {
              const element = document.getElementById("today");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Today
          </button>
          <i className="" onClick={handleDecreaseMonth}>
            <MdNavigateBefore />
          </i>
          <i onClick={handleAddMonth}>
            <MdNavigateNext />
          </i>
          <div className="text-xl text-white">
            {months[currentMonth]} {cY !== currentYear && currentYear}
          </div>
        </div>
        <div className="flex">
          <div>month view</div>
          <div>filter</div>
          <div>color</div>
        </div>
      </nav>
      <div className=" border-border-defaultt flex flex-1 flex-col rounded-l-lg  ">
        <header>
          <ul
            className="flex w-full border-b border-border-default
           py-1 pr-[18px] text-sm  last:border-r-0 [&>li]:w-[calc(100%/7)]
         [&>li]:pl-2 [&>li]:text-muted-dark"
          >
            {days.map((day, index) => (
              <li
                className={`border- border-border-default ${
                  index === days.length ? "" : ""
                } `}
                key={index}
              >
                {day}
              </li>
            ))}
          </ul>
        </header>
        <div className="relative flex flex-1">
          <ul
            className="calendarScrollBar absolute inset-0 h-full overflow-y-auto"
            id="calendarBoxScollParent"
            ref={calendarBoxScollParent}
          >
            {filledMonthsDates.map((month, monthIndex) => (
              <li
                className="grid grid-flow-row  "
                key={month.name + month.year}
                id="calendarBoxParent"
              >
                {month.dates.map((dateArr: Date[], rowIndex: number) => {
                  const dateArrLastElementDate = new Date(
                    dateArr[dateArr.length - 1],
                  );
                  const rowKey = `${dateArrLastElementDate.getFullYear()}${dateArrLastElementDate.getMonth()}${dateArrLastElementDate.getDate()}${rowIndex}  `;
                  // localStorage.removeItem(rowKey);
                  return (
                    <CalendarRow
                      dateArr={dateArr}
                      monthIndex={monthIndex}
                      rowIndex={rowIndex}
                      projectId={params.projectId}
                      taskWithDateRange={taskWithDateRange}
                      currentMonth={currentMonth}
                      currentYear={currentYear}
                      setCurrentMonth={setCurrentMonth}
                      setCurrentYear={setCurrentYear}
                      taskHoverStatusObj={taskHoverStatusObj}
                      setTaskHoverStatusObj={setTaskHoverStatusObj}
                    />
                  );
                })}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default page;
