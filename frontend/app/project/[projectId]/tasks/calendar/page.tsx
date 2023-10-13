"use client";
import CalendarBox from "@/components/project/calendar/CalendarBox";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useState } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Project from "@/interfaces/project";
import generateDates from "@/utilis/generateDates";

const page = ({ params }: { params: { projectId: string } }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const { activeProject, setActiveProject } = useGlobalContext();

  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [color, setcolor] = useState("no-color");

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
  

  const dates = generateDates(year, month);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const properlyIndexedDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDay = properlyIndexedDays[dates[0].getDay()];
  const noOfDaysToUnshift = days.indexOf(firstDay);

  const getPrevMonthDays = () => {
    if (month === 0) {
      return generateDates(year - 1, 11);
    } else {
      return generateDates(year, month - 1);
    }
  };
  const getNextMonthDays = () => {
    if (month === 11) {
      return generateDates(year + 1, 0);
    } else {
      return generateDates(year, month + 1);
    }
  };

  const prevMonthDays = getPrevMonthDays(); //make sure you check if in last or first month go back one year if first and go forward one year if last
  const daysToFill = prevMonthDays.slice(-noOfDaysToUnshift);

  dates.unshift(...daysToFill);

  const noOfDaysToPush = 7 - (dates.length % 7);
  if (dates.length % 7 !== 0) {
    const nextMonthDays = getNextMonthDays(); //make sure you check if in last or first month go back one year if first and go forward one year if last
    const daysToFill = nextMonthDays.slice(0, noOfDaysToPush);
    dates.push(...daysToFill);
  }

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
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };
  const handleDecreaseMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  if (!activeProject?.sections) return <>loading state</>;

  const allTasks = activeProject.sections
    .map((section) => {
      if (typeof section === "string") return;
      return section.tasks;
    })
    .flat(1);
  const taskWithDueDate = allTasks.filter((task) => {
    if (typeof task === "string") return;
    return task?.dueDate;
  });


// if the starts with that day it will have a p to the right 
//  if the task ends it will have a padding to the right 
//  if it does not start or end with that day it has no padding 
// 
//   
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
            onClick={() => {
              setYear(currentYear);
              setMonth(currentMonth);
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
            {months[month]} {year}
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
        <div className="grid grid-flow-row grid-cols-7    overflow-y-auto h-[calc(100dvh-300px)] calendarScrollBar">
          {dates.map((date, index) => (
            <CalendarBox
              date={date}
              projectId={params.projectId}
              isNotinMonth={
                index < noOfDaysToUnshift ||
                index >= dates.length - noOfDaysToPush
              }
              index={index}
              taskWithDueDate={taskWithDueDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
