import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent,
  useCallback,
} from "react";
import CalendarRow from "./CalendarRow";
import { MdAccessTime, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { fillMonthsDates } from "@/utilis/fillMonthsDates";
import generateDatesMonths from "@/utilis/generateDatesMonths";
import { fillMonthsDatesReverse } from "@/utilis/fillMonthsDatesReverse";
import Task from "@/interfaces/task";
import {
  days,
  daysWithoutWeekend,
  hideWeekendDayWidth,
  months,
} from "@/constants/calendar";
import Project from "@/interfaces/project";
import { useCalendarStore } from "@/store/calendarStore";

type Props = {
  paramsProjectId: string;
  project: Project | null;
};

const Calendar: React.FC<Props> = ({ paramsProjectId, project }) => {
  const currentDate = new Date();
  const cM = currentDate.getMonth();
  const cY = currentDate.getFullYear();

  const prevMonth = cM === 0 ? 11 : cM - 1;
  const prevYear = cM === 0 ? cY - 1 : cY;

  const {
    showWeekend,
    setShowWeekend,
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,
    newTaskDuration,
    setNewTaskDuration,
    setTaskWithDateRange,
  } = useCalendarStore();

  const filledFourMonths = useRef(
    fillMonthsDates(generateDatesMonths(prevYear, prevMonth, 4), null),
  ).current;

  const [filledMonthsDates, setFilledMonthsDates] = useState(filledFourMonths);

  const calendarBoxScollParent = useRef(null);

  const addNextMonth = () => {
    const lastMonthInFilledMonthsDates =
      filledMonthsDates[filledMonthsDates.length - 1];

    const lastMonthIndex = months.findIndex(
      (month) =>
        month.toLowerCase() === lastMonthInFilledMonthsDates.name.toLowerCase(),
    );
    if (lastMonthIndex !== -1) {
      let generateDatesYear = lastMonthInFilledMonthsDates.year;
      let generateDatesMonth = lastMonthIndex + 1;

      if (generateDatesMonth >= 12) {
        generateDatesMonth = 0;
        generateDatesYear++;
      }

      const DatesArrInLastMonthInFilledMonthsDates =
        lastMonthInFilledMonthsDates.dates.flat();

      const newFilledMonthsDates = fillMonthsDates(
        generateDatesMonths(generateDatesYear, generateDatesMonth, 3),
        DatesArrInLastMonthInFilledMonthsDates[
          DatesArrInLastMonthInFilledMonthsDates.length - 1
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
      let generateDatesMonth = firstMonthIndex - 3;

      if (generateDatesMonth < 0) {
        generateDatesMonth += 12;
        generateDatesYear--;
      }

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

  // get all tasks in project
  const allTasks = useMemo(() => {
    if (!project) return [];
    return project.sections
      .map((section) => {
        if (typeof section === "string") return;
        return section.tasks;
      })
      .flat(1);
  }, [project?.sections]);

  const taskWithDateRangeDefault = useMemo(
    () =>
      allTasks.filter((task) => {
        if (typeof task !== "object") return false;
        return task?.dateToStart && task?.dueDate;
      }),
    [allTasks],
  ) as Task[];

  useEffect(() => {
    setTaskWithDateRange(taskWithDateRangeDefault);
  }, [taskWithDateRangeDefault]);

  if (!project) return <>loading</>;

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
            text-xs hover:border-white hover:bg-menuItem-hover hover:text-white"
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
            {months[currentMonth]} {currentYear}
          </div>
        </div>
        <div className="flex">
          {/* <button onClick={}> back </button>
          <button onClick={}>forward</button> */}

          {/* <div>month view</div>
          <div>filter</div>
          <div>color</div> */}

          {newTaskDuration}
          <input
            type="number"
            value={newTaskDuration}
            onChange={(e) => setNewTaskDuration(parseInt(e.target.value))}
          />
          {JSON.stringify(showWeekend)}
          <input
            type="checkbox"
            checked={showWeekend}
            onChange={(e) => setShowWeekend(e.target.checked)}
          />
        </div>
      </nav>
      <div className=" border-border-defaultt flex flex-1 flex-col rounded-l-lg  ">
        <header>
          <ul
            className={`first-letter: flex w-full border-b
            border-border-default py-1  pr-[18px] 
            last:border-r-0 [&>li]:pl-2 [&>li]:text-muted-dark
            ${
              showWeekend
                ? "[&>li]:w-[calc(100%/7)]"
                : `[&>li]:w-[calc(100%/5)]`
            }
            `}
            style={{
              paddingLeft: showWeekend ? 0 : hideWeekendDayWidth,
              paddingRight: showWeekend ? 0 : hideWeekendDayWidth,
            }}
          >
            {(showWeekend ? days : daysWithoutWeekend).map((day, index) => (
              <li
                className={`border- border-border-default text-xs font-medium ${
                  index === days.length ? "" : ""
                } `}
                style={{
                  width: `calc(100% - ${hideWeekendDayWidth * 2}px )`,
                }}
                key={index}
              >
                {day.toUpperCase()}
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
