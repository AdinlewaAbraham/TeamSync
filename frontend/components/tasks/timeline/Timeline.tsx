import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/project/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Project from "@/interfaces/project";
import generateDates from "@/utilis/generateDates";
import TimelineSideBarItem from "@/components/tasks/timeline/TimelineSideBarItem";
import TimelineMonthComponent from "@/components/tasks/timeline/TimelineMonthComponent";
import { TimelineSectionObj } from "@/app/project/[projectId]/tasks/timeline/page";
import generateDatesMonths from "@/utilis/generateDatesMonths";

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
  const currentMonth = currentDate.getMonth() - 1;
  const currentYear = currentDate.getFullYear();

  const fourMonths = generateDatesMonths(currentYear, currentMonth, 4);
  const [months, setMonths] = useState(fourMonths);
  const { activeProject } = useGlobalContext();
  const [selectedDateObject, setSelectedDateObject] = useState<{
    startDate: Date;
    endDate: Date;
  } | null>(null);
  const [scrollposition, setScrollposition] = useState({ x: 0, y: 0 });
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
    if (typeof timelineSectionObj === "object") {
      localStorage.setItem(
        "timelineSectionObj",
        JSON.stringify(timelineSectionObj),
      );
    }
  }, [timelineSectionObj]);

  // useEffect(() => {
  //   if (timelineRef.current) {
  //     document.getElementById("today")?.scrollIntoView();
  //   }
  // }, [timelineRef.current, activeProject]);

  const allTasks = useMemo(
    () =>
      activeProject?.sections
        .map((section) => {
          if (typeof section === "string") return;
          return section.tasks;
        })
        .flat(1),
    [activeProject?.sections],
  );
  const taskWithDateRange = useMemo(
    () =>
      allTasks?.filter((task) => {
        if (typeof task !== "object") return;
        return task?.dateToStart && task.dueDate;
      }),
    [allTasks],
  );
  if (!activeProject || !taskWithDateRange) return <div>loading timeline</div>;

  const noOfMonthsTOAddToinfinityScroll = 3;
  const handleAddToLeft = () => {
    if (!timelineRef.current) return;
    let generateDatesYear = months[0].year;
    let generateDatesMonth =
      monthNames.findIndex(
        (month) => month.toLowerCase() === months[0].name.toLowerCase(),
      ) - 3;

    if (generateDatesMonth < 0) {
      generateDatesMonth += 12;
      generateDatesYear--;
    }
    const prevMonths = generateDatesMonths(
      generateDatesYear,
      generateDatesMonth,
      noOfMonthsTOAddToinfinityScroll,
    );
    const newMonths = [...prevMonths, ...months];
    let allDatesAddedLength = 0;
    for (let i = 0; i < newMonths.length; i++) {
      allDatesAddedLength += newMonths[i].dates.length;
    }
    (
      timelineRef.current as HTMLElement
    ).scrollLeft = allDatesAddedLength * 40;

    setMonths(newMonths);
    console.log(allDatesAddedLength * 40);
  };

  const handleAddToRight = () => {
    const lastMonth = months[months.length - 1];

    let generateDatesYear = lastMonth.year;
    let generateDatesMonth =
      monthNames.findIndex(
        (month) => month.toLowerCase() === lastMonth.name.toLowerCase(),
      ) + 1;

    if (generateDatesMonth >= 12) {
      generateDatesMonth = 0;
      generateDatesYear++;
    }
    const nextMonths = generateDatesMonths(
      generateDatesYear,
      generateDatesMonth,
      noOfMonthsTOAddToinfinityScroll,
    );
    setMonths([...months, ...nextMonths]);
  };
  const handleScroll = () => {
    if (!timelineRef.current) return;
    const timelineElement = timelineRef.current as HTMLElement;

    const threshold = 500;
    const isNearLeftEdge = timelineElement.scrollLeft <= threshold;
    const isNearRightEdge =
      timelineElement.scrollWidth - timelineElement.scrollLeft <=
      timelineElement.clientWidth + threshold;

    if (isNearLeftEdge) {
      console.log("near left");
      handleAddToLeft();
      setScrollposition({ x: timelineElement.scrollLeft, y: 0 });
    }

    if (isNearRightEdge) {
      console.log("near rigth");
      handleAddToRight();
      setScrollposition({ x: timelineElement.scrollLeft, y: 0 });
    }
  };
  console.log("i rerendered");
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
                <div
                  className="flex flex-col"
                  key={month.name + month.year + "header"}
                >
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
              onScroll={handleScroll}
            >
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
              <div
                className="absolute bottom-0 top-0 h-full w-1 opacity-0"
                ref={timelineHeightRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
