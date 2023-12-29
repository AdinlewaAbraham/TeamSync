import React, { useEffect, useRef, useState } from "react";
import CalendarRow from "./CalendarRow";
import { MdAccessTime, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import generateDatesForFourMonths from "@/utilis/generateDatesForFourMonths";
import generateDates from "@/utilis/generateDates";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import Project from "@/interfaces/project";
import { redirectToLogin } from "@/helpers/redirect";
import fetchProject from "@/helpers/project/fetchProject";
import { useGlobalContext } from "@/context/GeneralContext";

const Calendar = ({ paramsProjectId }: { paramsProjectId: string }) => {
  const { activeProject } = useGlobalContext();
  if (!activeProject) return <>loading</>;
  const currentDate = new Date();
  const cM = currentDate.getMonth();
  const cY = currentDate.getFullYear();

  const [currentMonth, setCurrentMonth] = useState<number>(cM);
  const [currentYear, setCurrentYear] = useState<number>(cY);
  const [monthsDates, setmonthsDates] = useState(
    generateDatesForFourMonths(cY, cM),
  );
  const [taskHoverStatusObj, setTaskHoverStatusObj] =
    useState<TaskHoverStatusObj>({ shutUpTs: true });

  const calendarBoxScollParent = useRef(null);

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

  let lastDayPushed: Date | null;
  var filledMonthsDates = monthsDates.map((month) => {
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
  useEffect(() => {
    localStorage.removeItem("localTaskPositionObject");
  }, [taskWithDateRange]);
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
            className="calendarScrollBar absolute inset-0 h-full overflow-y-auto overflow-x-hidden"
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
                      projectId={paramsProjectId}
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

export default Calendar;
