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

const page = ({ params }: { params: { projectId: string } }) => {
  const currentDate = new Date();
  const cM = currentDate.getMonth();
  const cY = currentDate.getFullYear();

  const { activeProject, setActiveProject } = useGlobalContext();

  const [currentMonth, setCurrentMonth] = useState<number>(cM);
  const [monthsDates, setmonthsDates] = useState(
    generateDatesForFourMonths(cY, cM)
  );
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
      firstDayInDates.getFullYear()
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
          daysToUnshit[daysToUnshit.length - 1]
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
        firstDayInDates.getFullYear()
      );
      const daysToFill = nextMonthDays.slice(0, noOfDaysToPush);
      dates.push(...daysToFill);
      lastDayPushed = daysToFill[daysToFill.length - 1];
      if (daysToFill.length === 0) {
        lastDayPushed = null;
      }
    }
    return { ...month, dates: dates };
  });
  const [havescrolled, setHavescrolled] = useState(false);
  useEffect(() => {
    // if (filledMonthsDates.length > 0){

    // }
    const scrollToElement = document.getElementsByClassName(
      "currentMonthFirstDate"
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
    console.log("i exist");
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        console.log(`Element width changed to ${newWidth}px`);
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

  // if the starts with that day it will have a p to the right
  //  if the task ends it will have a padding to the right
  //  if it does not start or end with that day it has no padding

  return (
    <div className="select-none">
      <nav className="flex justify-between py-2 text-sm items-center border-t border-border-default">
        <div
          className="flex items-center text-muted-dark 
           [&>i]:rounded-lg hover:[&>i]:bg-menuItem-active [&>i]:h-9
       [&>i]:w-7 [&>i]:flex [&>i]:items-center  [&>i]:justify-center  [&>i]:text-muted-dark 
       hover:[&>i]:text-white [&>i]:duration-150 [&>i]:transition-colors  [&>i]:text-lg [&>i]:cursor-pointer   "
        >
          <button
            className="h-9 border border-border-default rounded-lg px-2 hover:text-white hover:border-white hover:bg-menuItem-hover
        flex items-center justify-center"
            // onClick={() => {
            //   setYear(currentYear);
            //   setMonth(currentMonth);
            //   const element = document.getElementById("today");
            //   element?.scrollIntoView({ behavior: "smooth" });
            // }}
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
      <div className=" rounded-l-lg border-b border-t  border-l border-border-default  ">
        <header>
          <ul
            className="flex [&>li]:text-muted-dark w-full [&>li]:w-[calc(100%/7)]
           pr-[18px] [&>li]:pl-2 border-b  text-sm py-1
         border-border-default last:border-r-0"
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
        <div
          className="overflow-y-auto h-[calc(100dvh-310px)] calendarScrollBar"
          id="calendarBoxScollParent"
          ref={calendarBoxScollParent}
        >
          {filledMonthsDates.map((month, monthIndex) => (
            <div
              className="grid grid-flow-row grid-cols-7 "
              key={month.name + month.year}
              id="calendarBoxParent"
            >
              {month.dates.map((date: Date, index: number) => (
                <CalendarBox
                  date={new Date(date)}
                  projectId={params.projectId}
                  highlight={
                    new Date(date).getMonth() === currentMonth &&
                    new Date(date).getFullYear() === currentYear
                  }
                  index={index}
                  taskWithDateRange={taskWithDateRange}
                  key={index + new Date(date).getMonth()}
                  monthIndex={monthIndex}
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                  setCurrentMonth={setCurrentMonth}
                  setCurrentYear={setCurrentYear}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
