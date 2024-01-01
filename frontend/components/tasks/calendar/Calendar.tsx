import React, { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import CalendarRow from "./CalendarRow";
import { MdAccessTime, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import generateDatesForFourMonths from "@/utilis/generateDatesMonths";
import generateDates from "@/utilis/generateDates";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import Project from "@/interfaces/project";
import { redirectToLogin } from "@/helpers/redirect";
import { useGlobalContext } from "@/context/GeneralContext";
import { fillMonthsDates } from "@/utilis/fillMonthsDates";
import generateDatesMonths from "@/utilis/generateDatesMonths";
import { fillMonthsDatesReverse } from "@/utilis/fillMonthsDatesReverse";
import Task from "@/interfaces/task";

const Calendar = ({
  paramsProjectId,
  project,
}: {
  paramsProjectId: string;
  project: Project | null;
}) => {
  if (!project) return <>loading</>;
  const currentDate = new Date();
  const cM = currentDate.getMonth();
  const cY = currentDate.getFullYear();

  const prevMonth = cM === 0 ? 11 : cM - 1;
  const prevYear = cM === 0 ? cY - 1 : cY;

  const fillEdFourMonths = fillMonthsDates(
    generateDatesMonths(prevYear, prevMonth, 4),
    null,
  );

  const [currentMonth, setCurrentMonth] = useState<number>(cM);
  const [currentYear, setCurrentYear] = useState<number>(cY);
  const [filledMonthsDates, setFilledMonthsDates] = useState(fillEdFourMonths);

  const calendarBoxScollParent = useRef(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const properlyIndexedDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  function isSameDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  const addNextMonth = () => {
    const lastMonthInFilledMonthsDates =
      filledMonthsDates[filledMonthsDates.length - 1];

    const lastMonthIndex = months.findIndex(
      (month) =>
        month.toLowerCase() === lastMonthInFilledMonthsDates.name.toLowerCase(),
    );
    const lastMonthYear = lastMonthInFilledMonthsDates.year;
    if (lastMonthIndex !== -1) {
      const isLastMonthInYear = lastMonthIndex === 11;
      const getDateMonth = isLastMonthInYear ? 0 : lastMonthIndex + 1;
      const getDateYear = isLastMonthInYear ? lastMonthYear + 1 : lastMonthYear;

      let generateDatesYear = lastMonthInFilledMonthsDates.year;
      let generateDatesMonth =
        months.findIndex(
          (month) =>
            month.toLowerCase() ===
            lastMonthInFilledMonthsDates.name.toLowerCase(),
        ) + 1;

      if (generateDatesMonth >= 12) {
        generateDatesMonth = 0;
        generateDatesYear++;
      }
      console.log(generateDatesYear, generateDatesMonth);

      const newFilledMonthsDates = fillMonthsDates(
        generateDatesMonths(generateDatesYear, generateDatesMonth, 3),
        lastMonthInFilledMonthsDates.dates.flat()[
          lastMonthInFilledMonthsDates.dates.flat().length - 1
        ],
      );

      setFilledMonthsDates((prevFilledMonthsDate) => {
        return [...prevFilledMonthsDate, ...newFilledMonthsDates];
      });
    } else {
      console.error("last month not found");
    }
  };
  const addPrevMonth = () => {
    const firstMonthInFilledMonthsDates = filledMonthsDates[0];

    const firstMonthIndex = months.findIndex(
      (month) =>
        month.toLowerCase() ===
        firstMonthInFilledMonthsDates.name.toLowerCase(),
    );
    if (firstMonthIndex !== -1) {
      const firstDateInFilledMonthsDate = filledMonthsDates[0].dates.flat()[0];

      let generateDatesYear = filledMonthsDates[0].year;
      let generateDatesMonth =
        months.findIndex(
          (month) =>
            month.toLowerCase() === filledMonthsDates[0].name.toLowerCase(),
        ) - 3;

      if (generateDatesMonth < 0) {
        generateDatesMonth += 12;
        generateDatesYear--;
      }

      console.log(generateDatesMonth, generateDatesYear);

      const newFilledMonthsDates = fillMonthsDatesReverse(
        generateDatesMonths(generateDatesYear, generateDatesMonth, 3),
        new Date(firstDateInFilledMonthsDate),
      );

      setFilledMonthsDates((prevFilledMonthsDate) => {
        return [...newFilledMonthsDates, ...prevFilledMonthsDate];
      });
    } else {
      console.error("first month not found");
    }
  };
  const scrollToElement = (
    _currentMonth: number,
    _currentYear: number,
    isAdding: boolean,
  ) => {
    const monthElementToScrollTo = document.getElementById(
      "1" + _currentMonth + _currentYear,
    );
    console.log("1" + _currentMonth + _currentYear);
    if (!monthElementToScrollTo) {
      if (isAdding) {
        addNextMonth();
      } else {
        addPrevMonth();
      }
    }
    monthElementToScrollTo?.scrollIntoView({ behavior: "smooth" });
  };
  const goToNextMonth = () => {
    let _currentMonth;
    let _currentYear = currentYear;
    if (currentMonth === 11) {
      _currentMonth = 0;
      _currentYear = currentYear + 1;
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      _currentMonth = currentMonth + 1;
      setCurrentMonth(currentMonth + 1);
    }
    scrollToElement(_currentMonth, _currentYear, true);
  };

  const goToPrevMonth = () => {
    let _currentMonth;
    let _currentYear = currentYear;
    if (currentMonth === 0) {
      _currentMonth = 11;
      _currentYear = currentYear - 1;
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      _currentMonth = currentMonth - 1;
      setCurrentMonth(currentMonth - 1);
    }
    scrollToElement(_currentMonth, _currentYear, false);
  };

  // get all tasks in project
  const allTasks = useMemo(
    () =>
      project.sections
        .map((section) => {
          if (typeof section === "string") return;
          return section.tasks;
        })
        .flat(1),
    [project.sections],
  );
  const taskWithDateRange = allTasks.filter((task) => {
    if (typeof task !== "object") return;
    return task?.dateToStart && task.dueDate;
  });
  useMemo(() => {
    localStorage.removeItem("localTaskPositionObject");
  }, [project.sections]);
  useEffect(() => {
    const todayElement = document.getElementsByClassName("today");
    if (todayElement[0]) {
      todayElement[0].scrollIntoView();
    }
  }, []);

  const handleSCroll = () => {
    if (!calendarBoxScollParent.current) return;
    const threshold = 192;
    const calendarBoxScollParentElement =
      calendarBoxScollParent.current as HTMLElement;
    const isNearBottom =
      calendarBoxScollParentElement.scrollHeight -
        calendarBoxScollParentElement.scrollTop <=
      calendarBoxScollParentElement.clientHeight + threshold;
    const isNearTop = calendarBoxScollParentElement.scrollTop <= threshold;

    if (isNearTop) {
      addPrevMonth();
    }

    if (isNearBottom) {
      addNextMonth();
    }
  };
  console.log("i rerendered");
  return (
    <div className="flex flex-1 select-none flex-col">
      <nav className="flex items-center justify-between border-y border-border-default px-8 py-2 text-sm">
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
              const todayElement = document.getElementsByClassName("today");
              if (todayElement[0]) {
                todayElement[0].scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Today
          </button>
          <i className="" onClick={goToPrevMonth}>
            <MdNavigateBefore />
          </i>
          <i onClick={goToNextMonth}>
            <MdNavigateNext />
          </i>
          <div className="text-xl text-white">
            {months[currentMonth]} {cY !== currentYear && currentYear}
          </div>
        </div>
        <div className="flex">
          {/* <button onClick={}> back </button>
          <button onClick={}>forward</button> */}

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
            className="absolute inset-0 h-full overflow-y-auto overflow-x-hidden"
            id="calendarBoxScollParent"
            ref={calendarBoxScollParent}
            onScroll={handleSCroll}
          >
            {filledMonthsDates.map((month, monthIndex) => (
              <li
                className="grid grid-flow-row  "
                key={month.name + month.year}
                id={month.name + month.year}
              >
                {month.dates.map((dateArr: Date[], rowIndex: number) => {
                  const dateArrLastElementDate = new Date(
                    dateArr[dateArr.length - 1],
                  );
                  const rowKey = `${dateArrLastElementDate.getFullYear()}${dateArrLastElementDate.getMonth()}${dateArrLastElementDate.getDate()}${rowIndex}  `;
                  // localStorage.removeItem(rowKey);
                  return (
                    <CalendarRow
                      project={project}
                      dateArr={dateArr}
                      monthIndex={monthIndex}
                      rowIndex={rowIndex}
                      projectId={paramsProjectId}
                      taskWithDateRange={taskWithDateRange}
                      currentMonth={currentMonth}
                      currentYear={currentYear}
                      setCurrentMonth={setCurrentMonth}
                      setCurrentYear={setCurrentYear}
                      key={rowKey}
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

export default Calendar;
