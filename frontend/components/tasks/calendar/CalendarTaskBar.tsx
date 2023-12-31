import React, { useEffect, useRef, useState, DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Task from "@/interfaces/task";
import { BiCheckCircle } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import doTimeFramesOverlap from "@/utilis/doTimeFramesOverlap";
import { useGlobalContext } from "@/context/GeneralContext";

const CalendarTaskBar = ({
  index,
  task,
  isLast,
  calendarBoxDate,
  taskHoverStatusObj,
  setTaskHoverStatusObj,
  noOfDaysThatDoesNotStartOnDayButFallInTimeFrame,
  calendarIndex,
  rowKey,
  boxWidth,
  tasksThatStartOnDay,
}: {
  index: number;
  task: Task;
  isLast: boolean;
  calendarBoxDate: Date;
  taskHoverStatusObj: TaskHoverStatusObj;
  setTaskHoverStatusObj: (c: TaskHoverStatusObj) => void;
  noOfDaysThatDoesNotStartOnDayButFallInTimeFrame: number;
  calendarIndex: number;
  rowKey: string;
  boxWidth: number;
  tasksThatStartOnDay: (Task | undefined | string)[];
}) => {
  const [showCheckMark, setShowCheckMark] = useState<boolean>(false);
  const taskDateToStart = new Date(task.dateToStart);
  const doesNotStartOnDay =
    taskDateToStart.getFullYear() !== calendarBoxDate.getFullYear() ||
    taskDateToStart.getMonth() !== calendarBoxDate.getMonth() ||
    taskDateToStart.getDate() !== calendarBoxDate.getDate();

  const properlyIndexedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const taskStartDay = new Date(task.dateToStart);
  const dateIndex = properlyIndexedDays.findIndex(
    (day) => days[taskStartDay.getDay()] === day,
  );

  const daysInDateRange = calculateDaysBetweenDates(
    new Date(task.dateToStart),
    new Date(task.dueDate),
  );
  const noOfDaysToEnd = 7 - dateIndex;
  const hasOverflowToRight = daysInDateRange > noOfDaysToEnd;
  const widthForTasksWithOverflowToRight = hasOverflowToRight //remove right padding if task has overflow to right(if tasks does not end on that week)
    ? noOfDaysToEnd * boxWidth
    : daysInDateRange * boxWidth;
  const daysRemainingFromSpillOver = calculateDaysBetweenDates(
    new Date(calendarBoxDate),
    new Date(task.dueDate),
  );
  const goesAcross = daysRemainingFromSpillOver > 6;
  const doesTaskRunThrough = daysRemainingFromSpillOver > 7; // if tasks spans through the week
  const widthForTasksThatDoesNotStartOnDay = doesTaskRunThrough
    ? boxWidth * 7
    : daysRemainingFromSpillOver * boxWidth;

  // implement heigth or as you may say top
  const isMonday = calendarIndex === 0;

  const [top, setTop] = useState(0);

  const calculateTop = () => {
    const mondayTop =
      /* doesNotStartOnDay
    ?*/ index * 36 /* height of taskbar */ +
      40 /*hieght of top header */ +
      index * 4; //margin
    if (isMonday) {
      return mondayTop;
    }
    const localTaskPositionString = localStorage.getItem(
      "localTaskPositionObject",
    );
    const localTaskPositionObject = localTaskPositionString
      ? JSON.parse(localTaskPositionString)
      : null;
    const rowTaskPositionObj =
      typeof localTaskPositionObject === "object"
        ? localTaskPositionObject?.[rowKey]
        : null;
    if (
      typeof rowTaskPositionObj !== "object" ||
      Object.keys(rowTaskPositionObj).length === 0
    ) {
      return 40;
    }

    const taskTimeFrame = {
      startDate: task.dateToStart,
      dueDate: task.dueDate,
    };

    for (let i = 40; ; i += 40) {
      let isAvailable = true;

      for (const key in rowTaskPositionObj) {
        const taskPositionObj = rowTaskPositionObj[key];
        const currentTaskTimeFrame = {
          startDate: taskPositionObj.dateToStart,
          dueDate: taskPositionObj.dueDate,
        };

        if (key === task._id) return taskPositionObj.top;

        if (doTimeFramesOverlap(taskTimeFrame, currentTaskTimeFrame)) {
          if (i === taskPositionObj.top) {
            isAvailable = false;
            break;
          }
        }
      }

      if (isAvailable) {
        return i;
      }
    }
  };

  useEffect(() => {
    const newTop = calculateTop();
    const localTaskPositionString = localStorage.getItem(
      "localTaskPositionObject",
    );
    const localTaskPositionObject = localTaskPositionString
      ? JSON.parse(localTaskPositionString)
      : {};
    const parsedLocalRowTaskPositionObj = localTaskPositionObject?.[rowKey]
      ? localTaskPositionObject?.[rowKey]
      : {};

    localStorage.setItem(
      `localTaskPositionObject`,
      JSON.stringify({
        ...localTaskPositionObject,
        [rowKey]: {
          ...parsedLocalRowTaskPositionObj,
          [task._id]: {
            dateToStart: task.dateToStart,
            dueDate: task.dueDate,
            top: newTop,
          },
        },
      }),
    );
    setTop(newTop);
  }, [task, tasksThatStartOnDay]);
  // useEffect(() => {
  //   setTaskHoverStatusObj({ [task._id]: true });
  //   setTaskHoverStatusObj({ [task._id]: false });
  // }, [top]);

  /*
  NOTE: this will only run for all except mondays 
  function that calculates position top
  1. first create new obj that gets all task that fall on timeframe
  2. then use a for loop to increment from lowest top position and check if it is already occupied till top is found
  */
  const handleMouseEnter = () => {
    if (goesAcross || hasOverflowToRight || doesNotStartOnDay) {
      setTaskHoverStatusObj({ [task._id]: true });
      setShowCheckMark(true);
    }
  };
  const handleMouseLeave = () => {
    if (goesAcross || hasOverflowToRight || doesNotStartOnDay) {
      setTaskHoverStatusObj({ [task._id]: false });
      setShowCheckMark(false);
    }
  };

  const handleDeleteTask = async () => {
    console.log("handling task");
    try {
      const response = await fetch("/api/task/" + task._id, {
        method: "DELETE",
      });
      console.log(response.status);
      if (response.ok) {
      }
    } catch (error) {
      console.error(error);
    }
  };
  const dragStart = (e: DragEvent) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", task._id);
    }
  };
  return (
    <div
      onClick={() => {
        console.log(goesAcross);
        console.log(hasOverflowToRight);
      }}
    >
      <div
        key={task._id + index}
        onClick={() => console.log(calculateTop())}
        style={{
          width: doesNotStartOnDay
            ? widthForTasksThatDoesNotStartOnDay
            : widthForTasksWithOverflowToRight,
          ...(top > 192 - 36 ? { color: "red", top: top } : { top: top }),
        }}
        className={`taskBar absolute z-50 px-2 ${
          hasOverflowToRight && !doesNotStartOnDay && "pr-0"
        } ${goesAcross && "pr-0"}  ${doesNotStartOnDay && "pl-0"} `}
      >
        <div
          key={task._id}
          className={` group z-50 flex h-9 w-full cursor-pointer items-center rounded-lg 
          border-2 bg-bg-secondary px-3 py-1 text-xs transition-colors duration-150 hover:border-accent-blue
         ${isLast ? "" : "mb-1"} 
         ${
           hasOverflowToRight &&
           !doesNotStartOnDay &&
           "rounded-r-none border-r-0"
         } ${goesAcross && "border-r-0"} ${
           doesTaskRunThrough && "rounded-r-none"
         } ${doesNotStartOnDay && "rounded-l-none border-l-0 "}
         ${
           taskHoverStatusObj?.[task._id]
             ? "border-accent-blue"
             : "border-border-default"
         }  `}
          style={
            {
              // width: doesNotStartOnDay
              //   ? widthForTasksThatDoesNotStartOnDay
              //   : widthForTasksWithOverflowToRight,
              // left: doesNotStartOnDay ? 0 : padding / 2,
              // top: calculateTop(),
            }
          }
          onClick={() =>
            console.log(
              noOfDaysThatDoesNotStartOnDayButFallInTimeFrame,
              index,
              new Date(task.dateToStart).toDateString(),
              new Date(task.dueDate).toDateString(),
            )
          }
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          draggable
          onDragStart={dragStart}
        >
          {/* {dateIndex} */}
          <AnimatePresence>
            {showCheckMark && (
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                exit={{ x: 20 }}
                transition={{ duration: 0.15 }}
                className="mr-1 hidden items-center justify-center overflow-hidden text-[22px] text-gray-500
       group-hover:flex hover:text-accent-green "
              >
                <BiCheckCircle />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex-1 truncate whitespace-nowrap">
            {task.taskName}
          </div>
          <i onClick={handleDeleteTask} className="px-4 hover:border">
            <AiOutlineDelete />
          </i>
        </div>
      </div>
    </div>
  );
};

export default CalendarTaskBar;
