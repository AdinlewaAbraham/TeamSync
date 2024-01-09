import React, {
  MouseEvent,
  useEffect,
  useRef,
  useState,
  DragEvent,
} from "react";
import { useGlobalContext } from "@/context/GeneralContext";
import Task from "@/interfaces/task";
import CalendarTaskBar from "./CalendarTaskBar";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import findMinFreeRowNumber from "@/utilis/findMinFreeRowNumber";
import Section from "@/interfaces/section";
import Project from "@/interfaces/project";
import { fetchAndHelpRedirect } from "@/helpers/redirect";

const CalendarBox = ({
  project,
  date,
  projectId,
  highlight,
  index,
  monthIndex,
  rowIndex,
  taskWithDateRange,
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  rowKey,
  rowWidth,
}: {
  project: Project | null;
  date: Date;
  projectId: string;
  highlight: boolean;
  index: number;
  monthIndex: number;
  rowIndex: number;
  taskWithDateRange: (string | Task | undefined)[];
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (c: number) => void;
  setCurrentYear: (c: number) => void;
  rowKey: string;
  rowWidth: number;
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [showCheckMark, setShowCheckMark] = useState<boolean>(false);

  const { setTaskHoverStatusObj, taskHoverStatusObj } = useGlobalContext();
  const boxRef = useRef(null);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  }, [date]);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  const properlyIndexedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = new Date();

  const isToday =
    currentDate.getFullYear() === date.getFullYear() &&
    currentDate.getMonth() === date.getMonth() &&
    currentDate.getDate() === date.getDate();

  const newDate = new Date();

  const dateIndex = properlyIndexedDays.findIndex(
    (day) => days[date.getDay()] === day,
  );

  const numberOfTasksThatStartOnDay = taskWithDateRange.filter((task) => {
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
  }).length;
  const tasksThatStartOnDay = taskWithDateRange.filter((task) => {
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
  });
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
  const calendarBoxDate = new Date(date).getDate();

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
  return (
    <li
      id={date.getDate() + `${date.getMonth()}` + date.getFullYear()}
      className={` ${
        date.getDate() === 1 &&
        newDate.getMonth() === date.getMonth() &&
        newDate.getFullYear() === date.getFullYear() &&
        "currentMonthFirstDate"
      } ${
        isToday && "today"
      } relative box-border h-48 w-full cursor-cell border border-b-0 border-border-default ${
        (calendarBoxDate + 1) % 7 === 0 ? "border-r" : "border-r-0"
      } ${calendarBoxDate % 7 !== 0 ? "border-l" : "border-l-0"} ${
        monthIndex === 0 && rowIndex === 0 ? "border-t-0" : "border-t"
      } border-0 `}
      ref={boxRef}
      onClick={handleCalendarClick}
      onDragOver={allowDrop}
      onDrop={drop}
      onDragLeave={dragLeave}
    >
      <div
        className={`m-2 flex h-7 max-w-max items-center justify-center p-2 text-sm  ${
          !highlight && "text-muted-dark"
        } ${isToday && "rounded-lg bg-accent-blue"} `}
      >
        {date.getDate() === 1 && (
          <>{months[date.getMonth()].substring(0, 3)} </>
        )}
        {date.getDate()}
      </div>
      {tasksThatStartOnDay.map((task, index) => {
        if (typeof task !== "object") return;
        const isLast = tasksThatStartOnDay.length - 1 === index;
        return (
          <CalendarTaskBar
            index={index}
            task={task}
            isLast={isLast}
            calendarBoxDate={date}
            taskHoverStatusObj={taskHoverStatusObj}
            setTaskHoverStatusObj={setTaskHoverStatusObj}
            noOfDaysThatDoesNotStartOnDayButFallInTimeFrame={
              noOfDaysThatDoesNotStartOnDayButFallInTimeFrame
            }
            calendarIndex={dateIndex}
            rowKey={rowKey}
            boxWidth={rowWidth === 0 ? 0 : rowWidth / 7}
            tasksThatStartOnDay={tasksThatStartOnDay}
            key={task._id}
          />
        );
      })}
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
          />
        </div>
      )}
    </li>
  );
};

export default CalendarBox;
