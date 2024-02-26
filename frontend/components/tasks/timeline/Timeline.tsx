import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/project/fetchProject";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Project from "@/interfaces/project";
import generateDates from "@/utilis/generateDates";
import TimelineSideBarItem from "@/components/tasks/timeline/TimelineSideBarItem";
import TimelineMonthComponent from "@/components/tasks/timeline/TimelineMonthComponent";
import { TimelineSectionObj } from "@/app/project/[projectId]/timeline/page";
import generateDatesMonths from "@/utilis/generateDatesMonths";
import TimelineSideBar from "./TimelineSideBar";

const Timeline = ({
  paramProjectId,
  project,
}: {
  paramProjectId: string;
  project: Project | null;
}) => {
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
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  1;

  const fourMonths = generateDatesMonths(prevYear, prevMonth, 4);
  const [months, setMonths] = useState(fourMonths);
  console.log(currentYear, currentMonth);
  console.log(months);
  console.log(generateDatesMonths(currentYear, currentMonth, 4));
  const [selectedDateObject, setSelectedDateObject] = useState<{
    startDate: Date;
    endDate: Date;
  } | null>(null);
  const [allowAdd, setAllowAdd] = useState(false);
  const [allowScrollAdjust, setAllowScrollAdjust] = useState(true);
  const [isScrolledIntoView, setScrolledIntoView] = useState(false);
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

  const scrollElement = document.getElementById("today");

  useEffect(() => {
    console.log(scrollElement);
    if (scrollElement && !isScrolledIntoView) {
      scrollElement.scrollIntoView({ inline: "center" });

      setScrolledIntoView(true);
      setAllowAdd(true);
    }
  }, [scrollElement]);

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
  useEffect(() => {
    if (timelineRef.current && allowScrollAdjust) {
      let allDatesAddedLength = 0;
      const newMonths = months.slice(0, 3);
      for (let i = 0; i < newMonths.length; i++) {
        allDatesAddedLength += newMonths[i].dates.length;
      }
      if (months.length > 4)
        (timelineRef.current as HTMLElement).scrollLeft =
          allDatesAddedLength * 40 +
          (timelineRef.current as HTMLElement).scrollLeft;
      setAllowAdd(true);
    }
  }, [months]);

  const allTasks = useMemo(
    () =>
      project?.sections
        .map((section) => {
          if (typeof section === "string") return;
          return section.tasks;
        })
        .flat(1),
    [project?.sections],
  );
  const taskWithDateRange = useMemo(
    () =>
      allTasks?.filter((task) => {
        if (typeof task !== "object") return;
        return task?.dateToStart && task.dueDate;
      }),
    [allTasks],
  );

  useEffect(() => {
    console.log(selectedDateObject);
  }, [selectedDateObject]);
  if (!project || !taskWithDateRange) return <div>loading timeline</div>;

  const noOfMonthsTOAddToinfinityScroll = 3;
  const handleAddToLeft = () => {
    if (!timelineRef.current || !allowAdd) return;
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
    setAllowAdd(false);
    setAllowScrollAdjust(true);
    setMonths(newMonths);
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
    setAllowScrollAdjust(false);
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
    }

    if (isNearRightEdge) {
      console.log("near rigth");
      handleAddToRight();
    }
  };
  console.log("i rerendered");

  return (
    <div className="flex flex-1 flex-col">
      <nav className="flex h-14 items-center justify-between px-8">
        <div className="flex gap-2">
          <div>add task</div>
          <div>filter</div>
          <div>sort</div>
          <div>hide</div>
        </div>
        <div>more options</div>
      </nav>
      <div className="flex-1 overflow-hidden">
        <div className="relative flex h-full border-t border-border-default">
          <div className="h-full w-[200px]">
            <div className="flex h-full flex-1 flex-col">
              <div className="h-[50px] w-full border-b border-border-default" />
              <TimelineSideBar
                sections={project.sections}
                sidebarRef={sidebarRef}
                timelineSectionObj={timelineSectionObj}
                setTimelineSectionObj={setTimelineSectionObj}
              />
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
                        const highlightDate =
                          selectedDateObject &&
                          new Date(day) >=
                            new Date(selectedDateObject?.startDate) &&
                          new Date(day) <=
                            new Date(selectedDateObject?.endDate);

                        return (
                          <div
                            key={index}
                            className={`w-[40px]
                                  ${
                                    highlightDate
                                      ? "bg-accent-blue"
                                      : "bg-bg-primary"
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
                    activeProject={project}
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
    </div>
  );
};

export default Timeline;
