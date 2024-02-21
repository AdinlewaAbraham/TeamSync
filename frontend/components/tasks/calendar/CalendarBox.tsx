import React, {
  MouseEvent,
  useEffect,
  useRef,
  useState,
  DragEvent,
  useMemo,
} from "react";
import { useGlobalContext } from "@/context/GeneralContext";
import Task from "@/interfaces/task";
import CalendarTaskBar from "./CalendarTaskBar";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import findMinFreeRowNumber from "@/utilis/findMinFreeRowNumber";
import Section from "@/interfaces/section";
import Project from "@/interfaces/project";
import { fetchAndHelpRedirect } from "@/helpers/redirect";
import CalendarRowTaskPositionObject from "@/interfaces/calendarRowTaskPositionObject";
import {
  days,
  hideWeekendDayWidth,
  properlyIndexedDays,
} from "@/constants/calendar";

type Props = {
  project: Project | null;
  date: Date;
  projectId: string;
  highlight: boolean;
  index: number;
  monthIndex: number;
  rowIndex: number;
  taskWithDateRange: (string | Task | undefined)[];
  tasksInRow: Task[];
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (c: number) => void;
  setCurrentYear: (c: number) => void;
  rowKey: string;
  rowWidth: number;
  calendarRowTaskPositionObject: CalendarRowTaskPositionObject;
  showWeekend: boolean;
};
const CalendarBox: React.FC<Props> = ({
  project,
  date,
  projectId,
  highlight,
  index,
  monthIndex,
  rowIndex,
  taskWithDateRange,
  tasksInRow,
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  rowKey,
  rowWidth,
  calendarRowTaskPositionObject,
  showWeekend,
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [showCheckMark, setShowCheckMark] = useState<boolean>(false);

  const boxRef = useRef(null);

  useEffect(() => {
    const calendarBoxScollParentElement = document.getElementById(
      "calendarBoxScollParent",
    );

    const handleScroll = () => {
      if (date.getDate() === 1) {
        const calendarBoxElement = boxRef.current as HTMLElement | null;
        if (calendarBoxScollParentElement && calendarBoxElement) {
          const parentRect =
            calendarBoxScollParentElement.getBoundingClientRect();
          const childRect = calendarBoxElement.getBoundingClientRect();
          const pxToTop = childRect.top - parentRect.top;
          if (pxToTop <= 96) {
            setCurrentMonth(date.getMonth());
            setCurrentYear(date.getFullYear());
          }
        }
      }
    };

    if (calendarBoxScollParentElement) {
      calendarBoxScollParentElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (calendarBoxScollParentElement) {
        calendarBoxScollParentElement.removeEventListener(
          "scroll",
          handleScroll,
        );
      }
    };
  }, [date, setCurrentMonth, setCurrentMonth, boxRef]);

  const addTask = async () => {
    setShowInput(false);

    if (!projectId || !taskName || !date) return;

    if (typeof project?.sections[0] !== "object" || !project?.sections) {
      return;
    }
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 2);
    const sectionTasksWithDateRange = taskWithDateRange.filter((task) => {
      if (typeof task === "object") {
        return (
          task.sectionId === ((project.sections[0] as Section)?._id as string)
        );
      } else {
        return false;
      }
    });
    const rowNumber = findMinFreeRowNumber(
      sectionTasksWithDateRange,
      date,
      dueDate,
      0,
    );
    console.log(rowNumber);
    const postBody = {
      taskName,
      projectId,
      sectionId: project.sections[0]._id,
      dateToStart: date,
      dueDate: dueDate,
      rowNumber: rowNumber,
    };
    const { _response, data, status } = await fetchAndHelpRedirect(
      "/api/task/",
      {
        method: "POST",
        body: JSON.stringify(postBody),
      },
    );
    setTaskName("");

    if (_response.ok) {
      // update localtasks
    } else {
      console.log("something went wrong");
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
  const currentDate = new Date();

  const isToday =
    currentDate.getFullYear() === date.getFullYear() &&
    currentDate.getMonth() === date.getMonth() &&
    currentDate.getDate() === date.getDate();

  const newDate = new Date();

  const dateIndex = properlyIndexedDays.findIndex(
    (day) => days[date.getDay()] === day,
  );

  const numberOfTasksThatStartOnDay = useMemo(
    () =>
      taskWithDateRange.filter((task) => {
        if (typeof task !== "object") return false;

        const taskDateToStart = new Date(task.dateToStart);
        if (
          taskDateToStart.getMonth() === date.getMonth() &&
          taskDateToStart.getDate() === date.getDate() &&
          taskDateToStart.getFullYear() === date.getFullYear()
        ) {
          return true;
        }
        return false;
      }).length,
    [taskWithDateRange],
  );

  const tasksThatStartOnDay = useMemo(
    () =>
      taskWithDateRange.filter((task) => {
        if (typeof task !== "object") return false;

        const taskDateToStart = new Date(task.dateToStart);
        if (
          taskDateToStart.getMonth() === date.getMonth() &&
          taskDateToStart.getDate() === date.getDate() &&
          taskDateToStart.getFullYear() === date.getFullYear()
        ) {
          return true;
        }

        if (dateIndex === 0) {
          const taskStartDay = new Date(task.dateToStart);
          const taskDueDate = new Date(task.dueDate);

          return date > taskStartDay && date <= taskDueDate;
        }

        return false;
      }),
    [taskWithDateRange],
  ) as Task[];

  const noOfDaysThatDoesNotStartOnDayButFallInTimeFrame =
    taskWithDateRange.filter((task) => {
      if (typeof task !== "object") return false;
      const taskDueDate = new Date(task.dueDate);
      const taskDateToStart = new Date(task.dateToStart);
      return (
        date <= taskDueDate &&
        date >= taskDateToStart &&
        !(
          taskDateToStart.getDate() === date.getDate() &&
          taskDateToStart.getFullYear() === date.getFullYear() &&
          taskDateToStart.getMonth() === date.getMonth()
        )
      );
    }).length;

  const handleCalendarClick = (e: MouseEvent) => {
    const clickTarget = e.target as HTMLElement;
    if (clickTarget.closest(".taskBar")) {
      console.log("you just clicked on taskbar");
    } else {
      setShowInput(true);
    }
  };

  const allowDrop = (e: DragEvent) => {
    if (e) e.preventDefault();
    // stuff that hanldes effects hover drop effect in calendaBox like adding _blank to component
    console.log("i should be calculating and sorting and appending stuff");
  };

  const drop = (e: DragEvent) => {
    e.preventDefault();
    console.log(e.target);
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain");
      console.log(data);
    }
    console.log("i tried to drop");
  };

  const dragLeave = () => {
    console.log("i should be doing clean p");
  };

  const calendarBoxDate: number = new Date(date).getDate();
  const calendarBoxDayIndex: number = new Date(date).getDay();

  const dayStringName = properlyIndexedDays[calendarBoxDayIndex];

  const isFirstDayInDaysArr =
    dayStringName.toLowerCase().substring(0, 3) ===
    days[0].toLowerCase().substring(0, 3);
  const isLastDayInDaysArr =
    dayStringName.toLowerCase().substring(0, 3) ===
    days[days.length - 1].toLowerCase().substring(0, 3);

  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const hideWeekendBox = isWeekend && !showWeekend;

  return (
    <li
      id={date.getDate() + `${date.getMonth()}` + date.getFullYear()}
      className={`relative box-border h-48 cursor-cell border border-b-0 border-border-default
      ${
        date.getDate() === 1 &&
        newDate.getMonth() === date.getMonth() &&
        newDate.getFullYear() === date.getFullYear() &&
        "currentMonthFirstDate"
      } 
      ${isToday && "today"}  
      ${!isFirstDayInDaysArr && "border-l"} 
      ${monthIndex === 0 && rowIndex === 0 ? "border-t-0" : "border-t"}
      border-0 `}
      ref={boxRef}
      onClick={handleCalendarClick}
      onDragOver={allowDrop}
      onDrop={drop}
      onDragLeave={dragLeave}
      style={{
        width: hideWeekendBox ? hideWeekendDayWidth : "100%",
        minWidth: hideWeekendDayWidth,
      }}
    >
      <div
        className={`m-2 flex h-7 max-w-max items-center justify-center p-2 ${
          !highlight && "text-muted-dark"
        } ${isToday && "rounded-lg bg-accent-blue"} `}
      >
        {date.getDate() === 1 && <>{months[date.getMonth()]} </>}
        {date.getDate()}
      </div>
      <div className="relative">
        {!hideWeekendBox &&
          tasksThatStartOnDay
            // .sort((a, b) => a?.taskName?.localeCompare(b?.taskName))
            .map((task, index) => {
              if (typeof task !== "object") return;
              const isLast = tasksThatStartOnDay.length - 1 === index;
              return (
                <CalendarTaskBar
                  index={index}
                  task={task}
                  isLast={isLast}
                  calendarBoxDate={date}
                  noOfDaysThatDoesNotStartOnDayButFallInTimeFrame={
                    noOfDaysThatDoesNotStartOnDayButFallInTimeFrame
                  }
                  calendarIndex={dateIndex}
                  rowKey={rowKey}
                  boxWidth={
                    rowWidth === 0
                      ? 0
                      : hideWeekendBox
                        ? (rowWidth - hideWeekendDayWidth * 2) / days.length - 2
                        : rowWidth / 7
                  }
                  tasksThatStartOnDay={tasksThatStartOnDay}
                  key={task._id}
                  calendarRowTaskPositionObject={calendarRowTaskPositionObject}
                  tasksInRow={tasksInRow}
                />
              );
            })}
      </div>
      {showInput && (
        <div
          className="absolute z-50 flex w-full items-center justify-center px-2"
          style={{
            top:
              40 *
                (numberOfTasksThatStartOnDay +
                  noOfDaysThatDoesNotStartOnDayButFallInTimeFrame) +
                40 || 40,
          }}
        >
          <input
            className={`text-input flex items-center border-2 border-border-default bg-transparent text-sm focus:ring-0`}
            autoFocus
            onBlur={() => addTask()}
            onChange={(e) => setTaskName(e.target.value)}
            style={{
              left: 8,
              top: 0,
              width: rowWidth / 7 - 16,
            }}
            // onSelect={() => console.log("i have been selected")}
          />
        </div>
      )}
    </li>
  );
};

export default CalendarBox;
