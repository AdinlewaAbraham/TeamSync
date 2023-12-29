import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/project/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useRef, useState } from "react";
import Project from "@/interfaces/project";
import generateDates from "@/utilis/generateDates";
import generateDatesForFourMonths from "@/utilis/generateDatesForFourMonths";
import TimelineSideBarItem from "@/components/tasks/timeline/TimelineSideBarItem";
import TimelineMonthComponent from "@/components/tasks/timeline/TimelineMonthComponent";
import { TimelineSectionObj } from "@/app/project/[projectId]/tasks/timeline/page";

const Timeline = ({ paramProjectId }: { paramProjectId: string }) => {
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
  const localStorageValue = localStorage.getItem("timelineSectionObj");

  const defaultTimelineSectionObj = localStorageValue
    ? JSON.parse(localStorageValue)
    : undefined;
  const [timelineSectionObj, setTimelineSectionObj] =
    useState<TimelineSectionObj>(defaultTimelineSectionObj);
  const headerRef = useRef(null);
  const timelineRef = useRef(null);
  const sidebarRef = useRef(null);

  const timelineHeightRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current || !timelineRef.current || !sidebarRef.current)
      return;

    const headerElement = headerRef.current as HTMLElement;
    const timelineElement = timelineRef.current as HTMLElement;
    const sidebarElement = sidebarRef.current as HTMLElement;
    const handleScroll = (e: Event) => {
      headerElement.scrollLeft = timelineElement.scrollLeft;
      sidebarElement.scrollTop = timelineElement.scrollTop;
    };

    timelineElement.addEventListener("scroll", handleScroll);

    return () => {
      timelineElement.removeEventListener("scroll", handleScroll);
    };
  }, [timelineRef.current, headerRef.current, sidebarRef.current]);

  useEffect(() => {
    if (timelineHeightRef.current && sidebarRef.current) {
      const sidebarElement = sidebarRef.current as HTMLElement;
      const timelineHeightElement = timelineHeightRef.current;
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          sidebarElement.style.height = entry.contentRect.height + "px";
        }
      });
      resizeObserver.observe(timelineHeightElement);
      return () => resizeObserver.unobserve(timelineHeightElement);
    }
  }, [timelineHeightRef.current]);

  useEffect(() => {
    if (timelineRef.current) {
    }
  }, [timelineRef.current]);

  useEffect(() => {
    if (typeof timelineSectionObj === "object") {
      localStorage.setItem(
        "timelineSectionObj",
        JSON.stringify(timelineSectionObj),
      );
    }
  }, [timelineSectionObj]);

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
      (monthName) => firstMonth.name === monthName,
    );

    const prevMonth = getPrevMonthDays(yearOfFirstMonth, monthOfFirstMonth);
    setMonths([prevMonth, ...months]);
    console.log(months);
  };
  const handleAddToRight = () => {
    const lastMonth = months[months.length - 1];
    const yearOfFirstMonth = lastMonth.year;
    const monthOfFirstMonth = monthNames.findIndex(
      (monthName) => lastMonth.name === monthName,
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
  if (!activeProject) return <div>loading timeline</div>;

  return (
    <div className="flex-1 overflow-hidden ">
      {/* <nav className="flex items-center justify-between border-t border-border-default  py-2 pl-8 text-sm">
        <div className="flex h-9 items-center justify-center"> add task</div>
      </nav> */}
      <div className="relative flex h-full border-t border-border-default">
        <div className="h-full w-[200px]">
          <div className="flex h-full flex-1 flex-col">
            <div className="h-[50px] w-full border-b border-border-default" />
            <div className="relative h-full flex-1 overflow-y-hidden border-r border-border-default">
              <div
                className="absolute inset-0 flex-1 overflow-y-hidden"
                ref={sidebarRef}
              >
                {activeProject.sections.map((section) => (
                  <TimelineSideBarItem
                    section={section}
                    timelineSectionObj={timelineSectionObj}
                    setTimelineSectionObj={setTimelineSectionObj}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-0 flex flex-1 flex-col overflow-x-auto ">
            <header
              className="relative flex h-[50px] overflow-x-hidden border-b border-border-default pr-[20px]"
              ref={headerRef}
            >
              {months.map((month, index) => (
                <div className="flex flex-col" key={index}>
                  <div className="sticky left-0 max-w-max px-2 ">
                    {month.name} {month.year}
                  </div>
                  <div className="flex">
                    {month.dates.map((day, index) => {
                      const month = selectedDateObject?.startDate.getUTCMonth();
                      const year = selectedDateObject?.startDate.getFullYear();

                      const highlightDate =
                        selectedDateObject &&
                        new Date(day) >=
                          new Date(selectedDateObject?.startDate) &&
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
              className="relative flex h-full  flex-1  overflow-auto"
              ref={timelineRef}
            >
              <div
                className="absolute bottom-0 top-0 h-full w-1 opacity-0"
                ref={timelineHeightRef}
              />
              {months.map((month) => (
                <TimelineMonthComponent
                  activeProject={activeProject}
                  month={month}
                  paramProjectId={paramProjectId}
                  setSelectedDateObject={setSelectedDateObject}
                  setTimelineSectionObj={setTimelineSectionObj}
                  taskWithDateRange={taskWithDateRange}
                  timelineSectionObj={timelineSectionObj}
                  key={month.name + month.year}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
