"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useRef, useState } from "react";
import Project from "@/interfaces/project";
import generateDates from "@/utilis/generateDates";
import TimelineVerticalBars from "@/components/project/timeline/TimelineVerticalBars";
import HourHorizontalColums from "@/components/project/timeline/HourHorizontalColums";

const page = ({ params }: { params: { projectId: string } }) => {
  const monthNames = [
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
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const fourMonths = generateDatesForFourMonths(currentYear, currentMonth);
  const [months, setMonths] = useState(fourMonths);
  const { setActiveProject, activeProject } = useGlobalContext();
  const [scrollPosition, setscrollPosition] = useState<number>(0);
  const [selectedDateObject, setSelectedDateObject] = useState<{
    startDate: Date;
    endDate: Date;
  } | null>(null);

  const headerRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current || !timelineRef.current) return;

    const headerElement = headerRef.current as HTMLElement;
    const timelineElement = timelineRef.current as HTMLElement;
    const handleScroll = (e: Event) => {
      headerElement.scrollLeft = timelineElement.scrollLeft;
    };

    timelineElement.addEventListener("scroll", handleScroll);

    // Make sure to remove the event listener when the component unmounts
    return () => {
      timelineElement.removeEventListener("scroll", handleScroll);
    };
  }, [timelineRef.current, headerRef.current]);

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

  function generateDatesForFourMonths(year: number, month: number) {
    let currentYear = year;
    let currentMonth = month;
    const dates = [];
    const numberOfMonths = 4;
    const invalidMonthPrev = currentMonth - 1 < 0;
    const prevMonth = {
      name: invalidMonthPrev ? monthNames[11] : monthNames[currentMonth - 1],
      year: invalidMonthPrev ? currentYear-- : currentYear,
      dates: invalidMonthPrev
        ? generateDates(currentYear--, 11)
        : generateDates(currentYear, currentMonth - 1),
    };
    dates.push(prevMonth);
    for (let i = 0; i < numberOfMonths; i++) {
      const inValidMonthCurrent = currentMonth > 11;
      const nextYear = currentYear + 1;
      const month = {
        name: inValidMonthCurrent ? monthNames[0] : monthNames[currentMonth],
        year: inValidMonthCurrent ? nextYear : currentYear,
        dates: inValidMonthCurrent
          ? generateDates(nextYear, 0)
          : generateDates(currentYear, currentMonth),
      };
      dates.push(month);
      if (inValidMonthCurrent) {
        // reset
        currentYear++;
        currentMonth = 0;
      }
      currentMonth++;
    }

    return dates;
  }

  const getPrevMonthDays = (year: number, month: number) => {
    if (month === 0) {
      return {
        name: monthNames[11],
        year: year - 1,
        dates: generateDates(year - 1, 11),
      };
    } else {
      return {
        name: monthNames[month - 1],
        year,
        dates: generateDates(year, month - 1),
      };
    }
  };

  const getNextMonthDays = (year: number, month: number) => {
    if (month === 11) {
      return {
        name: monthNames[0],
        year: year + 1,
        dates: generateDates(year + 1, 0),
      };
    } else {
      return {
        name: monthNames[month + 1],
        year,
        dates: generateDates(year, month + 1),
      };
    }
  };
  const handleAddToLeft = () => {
    const firstMonth = months[0];
    const yearOfFirstMonth = firstMonth.year;
    const monthOfFirstMonth = monthNames.findIndex(
      (monthName) => firstMonth.name === monthName
    );

    const prevMonth = getPrevMonthDays(yearOfFirstMonth, monthOfFirstMonth);
    setMonths([prevMonth, ...months]);
    console.log(months);
  };
  const handleAddToRight = () => {
    const lastMonth = months[months.length - 1];
    const yearOfFirstMonth = lastMonth.year;
    const monthOfFirstMonth = monthNames.findIndex(
      (monthName) => lastMonth.name === monthName
    );

    const nextMonth = getNextMonthDays(yearOfFirstMonth, monthOfFirstMonth);
    setMonths([...months, nextMonth]);
    console.log(months);
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
  return (
    <div>
      <nav className="flex justify-between items-center py-2 text-sm  border-t border-border-default">
        <div className="h-9 flex justify-center items-center"> add task</div>
      </nav>
      <div className="border-t border-border-default h-full relative">
        <header
          className="flex relative overflow-x-hidden border-b border-border-default"
          ref={headerRef}
        >
          {months.map((month, index) => (
            <div className="flex flex-col relative" key={index}>
              <div className="max-w-max px-2 sticky left-0 ">
                {month.name} {month.year}
              </div>
              <div className="flex">
                {month.dates.map((day, index) => {
                  const month = selectedDateObject?.startDate.getUTCMonth();
                  const year = selectedDateObject?.startDate.getFullYear();

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
          ))}
        </header>
        <div
          className="flex overflow-x-scroll w-full relative  overflow-y-auto h-[calc(100dvh-340px)]"
          ref={timelineRef}
        >
          {months.map((month) => (
            <div key={month.name + month.year} className="">
              <div className="flex relative">
                <div className=" absolute grid grid-rows-1 z-10 ">
                  {Array.from({ length: 24 }).map((time, index) => (
                    <HourHorizontalColums
                      time={index + 1}
                      index={index}
                      projectId={params.projectId}
                      setSelectedDateObject={setSelectedDateObject}
                      month={monthNames.findIndex(
                        (monthname) => monthname === month.name
                      )}
                      year={month.year}
                      taskWithDateRange={taskWithDateRange}
                    />
                  ))}
                </div>
                {month.dates.map((day) => (
                  <TimelineVerticalBars
                    day={day}
                    setSelectedDateObject={setSelectedDateObject}
                    projectId={params.projectId}
                    taskWithDateToStart={taskWithDateRange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
