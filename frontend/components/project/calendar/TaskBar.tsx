import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Task from "@/interfaces/task";
import { BiCheckCircle } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";

const TaskBar = ({
  index,
  task,
  isLast,
  calendarDate,
  taskHoverStatusObj,
  setTaskHoverStatusObj,
  noOfDaysThatDoesNotStartOnDayButFallInTimeFrame,
  calendarIndex,
}: {
  index: number;
  task: Task;
  isLast: boolean;
  calendarDate: Date;
  taskHoverStatusObj: TaskHoverStatusObj;
  setTaskHoverStatusObj: (c: TaskHoverStatusObj) => void;
  noOfDaysThatDoesNotStartOnDayButFallInTimeFrame: number;
  calendarIndex: number;
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
  return (
    <div key={task._id + index}>
      <div
        className="h-1 w-full bg-transparent absolute"
        ref={(element) => (boxRef.current = element)}
      />
      <div
        key={task._id}
        className={`${
          isLast ? "" : "mb-1"
        } absolute z-50 bg-bg-secondary rounded-lg top-[${index * 36}px]
         ${
           hasOverflowToRight &&
           !doesNotStartOnDay &&
           "rounded-r-none border-r-0"
         } ${doesTaskRunThrough && "rounded-r-none"} ${
          doesNotStartOnDay && "rounded-l-none border-l-0 "
        }
        
         border-2 w-full border-border-default
       ${taskHoverStatusObj?.[task._id] && "border-accent-blue"}
          transition-colors duration-150
      px-3 py-1 text-xs h-9 flex items-center cursor-pointer group  `}
        style={{
          width: doesNotStartOnDay
            ? widthForTasksThatDoesNotStartOnDay
            : widthForTasksWithOverflowToRight,
          left: doesNotStartOnDay ? 0 : padding / 2,
          top: doesNotStartOnDay
            ? index * 36 +
              40 /*hieght of top header */ +
              /* height of taskbar */ index * 4 /* margin*/
            : ((isMonday ? 0 : index) +
                noOfDaysThatDoesNotStartOnDayButFallInTimeFrame) *
                36 +
              40 /*hieght of top header */ +
              /* height of taskbar */ ((isMonday ? 0 : index) +
                noOfDaysThatDoesNotStartOnDayButFallInTimeFrame) *
                4 /* margin*/,
        }}
        onClick={() =>
          console.log(
            noOfDaysThatDoesNotStartOnDayButFallInTimeFrame,
            index,
            new Date(task.dateToStart).toDateString(),
            new Date(task.dueDate).toDateString()
          )
        }
        // onMouseEnter={() => {
        //   setTaskHoverStatusObj({ ...taskHoverStatusObj, [task._id]: true });
        //   setShowCheckMark(true);
        // }}
        // onMouseLeave={() => {
        //   setTaskHoverStatusObj({ ...taskHoverStatusObj, [task._id]: false });
        //   setShowCheckMark(false);
        // }}
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
