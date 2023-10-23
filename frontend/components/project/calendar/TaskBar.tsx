import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Task from "@/interfaces/task";
import { BiCheckCircle } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import doTimeFramesOverlap from "@/utilis/doTimeFramesOverlap";

const TaskBar = ({
  index,
  task,
  isLast,
  calendarDate,
  taskHoverStatusObj,
  setTaskHoverStatusObj,
  noOfDaysThatDoesNotStartOnDayButFallInTimeFrame,
  calendarIndex,
  rowKey,
}: {
  index: number;
  task: Task;
  isLast: boolean;
  calendarDate: Date;
  taskHoverStatusObj: TaskHoverStatusObj;
  setTaskHoverStatusObj: (c: TaskHoverStatusObj) => void;
  noOfDaysThatDoesNotStartOnDayButFallInTimeFrame: number;
  calendarIndex: number;
  rowKey: string;
}) => {
  const [showCheckMark, setShowCheckMark] = useState<boolean>(false);
  const handleTaskDelete = async (taskId: string) => {};

  const boxRef = useRef<HTMLElement | null>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const taskDateToStart = new Date(task.dateToStart);
  const doesNotStartOnDay =
    taskDateToStart.getFullYear() !== calendarDate.getFullYear() ||
    taskDateToStart.getMonth() !== calendarDate.getMonth() ||
    taskDateToStart.getDate() !== calendarDate.getDate();
  useEffect(() => {
    const element = boxRef.current;

    if (element) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setBoxWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.unobserve(element);
      };
    }
  }, []);
  const properlyIndexedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const taskStartDay = new Date(task.dateToStart);
  const dateIndex = properlyIndexedDays.findIndex(
    (day) => days[taskStartDay.getDay()] === day
  );

  const daysInDateRange = calculateDaysBetweenDates(
    new Date(task.dateToStart),
    new Date(task.dueDate)
  );
  const noOfDaysToEnd = 7 - dateIndex;
  const hasOverflowToRight = daysInDateRange > noOfDaysToEnd;
  const padding = 16;
  const widthForTasksWithOverflowToRight = hasOverflowToRight
    ? noOfDaysToEnd * boxWidth - padding / 2
    : daysInDateRange * boxWidth - padding;
  const daysRemainingFromSpillOver = calculateDaysBetweenDates(
    new Date(calendarDate),
    new Date(task.dueDate)
  );
  const doesTaskRunThrough = daysRemainingFromSpillOver > 7;
  const widthForTasksThatDoesNotStartOnDay = doesTaskRunThrough
    ? boxWidth * 7
    : daysRemainingFromSpillOver * boxWidth - padding / 2;

  // implement heigth or as you may say top
  const isMonday = calendarIndex === 0;

  const mondayTop =
    /* doesNotStartOnDay
    ?*/ index * 36 /* height of taskbar */ +
    40 /*hieght of top header */ +
    index * 4; /* margin*/
  // : (index -
  //     noOfDaysThatDoesNotStartOnDayButFallInTimeFrame +
  //     noOfDaysThatDoesNotStartOnDayButFallInTimeFrame) *
  //     36 /* height of taskbar */ +
  //   40 /*hieght of top header */ +
  //   (index -
  //     noOfDaysThatDoesNotStartOnDayButFallInTimeFrame +
  //     noOfDaysThatDoesNotStartOnDayButFallInTimeFrame) *
  //     4; /* margin*/
  /*
 useeffect
 add to object all the details of the task
*/
  const calculateTop = () => {
    if (isMonday) {
      return mondayTop;
    }
    const localRowTaskPositionObj = localStorage.getItem(rowKey);
    const rowTaskPositionObj = localRowTaskPositionObj
      ? JSON.parse(localRowTaskPositionObj)
      : undefined;
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
    // setRowTaskPositionObj((prev: any) => {
    //   if (typeof prev !== "object") {
    //     return {
    //       [task._id]: {
    //         dateToStart: task.dateToStart,
    //         dueDate: task.dueDate,
    //         top: calculateTop(),
    //       },
    //     };
    //   }

    //   return {
    //     ...prev,
    //     [task._id]: {
    //       dateToStart: task.dateToStart,
    //       dueDate: task.dueDate,
    //       top: calculateTop(),
    //     },
    //   };
    // });
    const localRowTaskPositionObj = localStorage.getItem(rowKey);
    const parsedLocalRowTaskPositionObj = localRowTaskPositionObj
      ? JSON.parse(localRowTaskPositionObj)
      : undefined;
    localStorage.setItem(
      rowKey,
      JSON.stringify({
        ...parsedLocalRowTaskPositionObj,
        [task._id]: {
          dateToStart: task.dateToStart,
          dueDate: task.dueDate,
          top: calculateTop(),
        },
      })
    );
  }, []);

  /*
  NOTE: this will only run for all except mondays 
  function that calculates top
  1. first create new obj that gets all task that fall on timeframe
  2. then use a for loop to increment from lowest top position and check if it is already occupied till top is found
  */
  const goesAcross = daysRemainingFromSpillOver > 6;
  return (
    <div key={task._id + index} onClick={() => console.log(calculateTop())}>
      <div
        className="h-1 w-full bg-transparent absolute"
        ref={(element) => (boxRef.current = element)}
      />
      <div
        key={task._id}
        className={`
         border-2 ${
           isLast ? "" : "mb-1"
         } absolute z-50 bg-bg-secondary rounded-lg top-[${index * 36}px]
         ${
           hasOverflowToRight &&
           !doesNotStartOnDay &&
           "rounded-r-none border-r-0"
         } ${goesAcross && "border-r-0"} ${
          doesTaskRunThrough && "rounded-r-none"
        } ${doesNotStartOnDay && "rounded-l-none border-l-0 "}
         w-full 
       ${
         taskHoverStatusObj?.[task._id]
           ? "border-accent-blue"
           : "border-border-default"
       }
          transition-colors duration-150
      px-3 py-1 text-xs h-9 flex items-center cursor-pointer group  `}
        style={{
          width: doesNotStartOnDay
            ? widthForTasksThatDoesNotStartOnDay
            : widthForTasksWithOverflowToRight,
          left: doesNotStartOnDay ? 0 : padding / 2,
          top: isMonday ? mondayTop : calculateTop(),
        }}
        onClick={() =>
          console.log(
            noOfDaysThatDoesNotStartOnDayButFallInTimeFrame,
            index,
            new Date(task.dateToStart).toDateString(),
            new Date(task.dueDate).toDateString()
          )
        }
        onMouseEnter={() => {
          setTaskHoverStatusObj({ [task._id]: true });
          setShowCheckMark(true);
          console.log(taskHoverStatusObj);
        }}
        onMouseLeave={() => {
          setTaskHoverStatusObj({ [task._id]: false });
          setShowCheckMark(false);
          console.log(taskHoverStatusObj);
        }}
        draggable
      >
        {/* {dateIndex} */}
        <AnimatePresence>
          {showCheckMark && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.5 }}
              className="group-hover:flex hidden overflow-hidden border justify-center text-[22px] items-center mr-1
       text-gray-500 hover:text-accent-green "
            >
              <BiCheckCircle />
            </motion.div>
          )}
        </AnimatePresence>
        <div>{task.taskName}</div>
        {/* <i onClick={() => handleTaskDelete(task._id)}>
          <AiOutlineDelete />
        </i> */}
      </div>
    </div>
  );
};

export default TaskBar;
