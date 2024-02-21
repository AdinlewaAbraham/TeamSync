import React, { useEffect, useRef, useState, DragEvent, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Task from "@/interfaces/task";
import { BiCheckCircle } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import doTimeFramesOverlap from "@/utilis/doTimeFramesOverlap";
import { useGlobalContext } from "@/context/GeneralContext";
import CalendarRowTaskPositionObject from "@/interfaces/calendarRowTaskPositionObject";
import { days, properlyIndexedDays } from "@/constants/calendar";

const CalendarTaskBar = ({
  index,
  task,
  isLast,
  calendarBoxDate,
  noOfDaysThatDoesNotStartOnDayButFallInTimeFrame,
  calendarIndex,
  rowKey,
  boxWidth,
  tasksThatStartOnDay,
  tasksInRow,
  calendarRowTaskPositionObject,
}: {
  index: number;
  task: Task;
  isLast: boolean;
  calendarBoxDate: Date;
  noOfDaysThatDoesNotStartOnDayButFallInTimeFrame: number;
  calendarIndex: number;
  rowKey: string;
  boxWidth: number;
  tasksThatStartOnDay: (Task | undefined | string)[];
  tasksInRow: Task[];
  calendarRowTaskPositionObject: CalendarRowTaskPositionObject;
}) => {
  const {
    setTaskHoverStatusObj,
    taskHoverStatusObj,
    calendarTaskbarHoverStatusObj,
  } = useGlobalContext();

  const [top, setTop] = useState(0);
  const [showCheckMark, setShowCheckMark] = useState<boolean>(false);

  const taskDateToStart = new Date(task.dateToStart);
  const doesNotStartOnDay =
    taskDateToStart.getFullYear() !== calendarBoxDate.getFullYear() ||
    taskDateToStart.getMonth() !== calendarBoxDate.getMonth() ||
    taskDateToStart.getDate() !== calendarBoxDate.getDate();

  const taskStartDay = new Date(task.dateToStart);
  const dateIndex = properlyIndexedDays.findIndex(
    (day) => days[taskStartDay.getDay()] === day,
  );

  const daysInDateRange = useMemo(
    () =>
      calculateDaysBetweenDates(
        new Date(task.dateToStart),
        new Date(task.dueDate),
      ),
    [task.dateToStart, task.dueDate],
  );
  const noOfDaysToEnd = 7 - dateIndex;
  const hasOverflowToRight = daysInDateRange > noOfDaysToEnd;
  const widthForTasksWithOverflowToRight = hasOverflowToRight
    ? noOfDaysToEnd * boxWidth
    : daysInDateRange * boxWidth;

  const daysRemainingFromSpillOver = useMemo(
    () =>
      calculateDaysBetweenDates(
        new Date(calendarBoxDate),
        new Date(task.dueDate),
      ),
    [JSON.stringify(calendarBoxDate), JSON.stringify(task.dueDate)],
  );
  const goesAcross = daysRemainingFromSpillOver > 7;
  const doesTaskRunThrough = daysRemainingFromSpillOver > 7; // if tasks spans through the week
  const widthForTasksThatDoesNotStartOnDay = doesTaskRunThrough
    ? boxWidth * 7
    : daysRemainingFromSpillOver * boxWidth;

  // implement height or as you may say top
  const isMonday = calendarIndex === 0;
  const tasksInRowDateMapping = useMemo(
    () =>
      tasksInRow
        .sort((a, b) => a.taskName.localeCompare(b.taskName))
        .map((task) => {
          if (typeof task !== "object") return task;
          return {
            dueDate: task?.dueDate,
            dateToStart: task?.dateToStart,
          };
        }),
    [JSON.stringify(tasksInRow)],
  );
  useEffect(() => {
    const calculateTop = () => {
      const margin = index * 4;
      const taskbarHeight = 36;
      const mondayTop = index * taskbarHeight + margin;
      if (isMonday) {
        return mondayTop;
      }
      if (
        typeof calendarRowTaskPositionObject !== "object" ||
        Object.keys(calendarRowTaskPositionObject).length === 0
      ) {
        return 0;
      }

      const taskTimeFrame = {
        startDate: task.dateToStart,
        dueDate: task.dueDate,
      };

      for (let i = 0; ; i += 40) {
        let isAvailable = true;

        for (const key in calendarRowTaskPositionObject) {
          const taskPositionObj = calendarRowTaskPositionObject[key];
          const currentTaskTimeFrame = {
            startDate: taskPositionObj.dateToStart,
            dueDate: taskPositionObj.dueDate,
          };

          if (key === task._id) return taskPositionObj.top;

          if (
            doTimeFramesOverlap(taskTimeFrame, currentTaskTimeFrame) &&
            i === taskPositionObj.top
          ) {
            isAvailable = false;
            break;
          }
        }

        if (isAvailable) {
          return i;
        }
      }
    };
    const newTop = calculateTop();

    calendarRowTaskPositionObject[task._id] = {
      dateToStart: task.dateToStart,
      dueDate: task.dueDate,
      top: newTop,
    };
    setTop(newTop);
    return () => {
      delete calendarRowTaskPositionObject[task._id];
    };
  }, [tasksInRow.length, JSON.stringify(tasksInRowDateMapping)]);

  const handleMouseEnter = () => {
    calendarTaskbarHoverStatusObj[task._id] = true;
    setShowCheckMark(true);
    if (goesAcross || hasOverflowToRight || doesNotStartOnDay) {
      setTaskHoverStatusObj({ [task._id]: true });
    }
  };
  const handleMouseLeave = () => {
    calendarTaskbarHoverStatusObj[task._id] = false;
    setShowCheckMark(false);
    if (goesAcross || hasOverflowToRight || doesNotStartOnDay) {
      setTaskHoverStatusObj({ [task._id]: false });
    }
  };

  const handleDeleteTask = async () => {
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

  const handleUpdateTask = async () => {
    const body = { taskName: "random" + Math.random() };
    try {
      const response = await fetch("/api/task/" + task._id, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      console.log(response.status);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTaskDateChange = async () => {
    const NewTaskDueDate = new Date(task.dueDate);
    NewTaskDueDate.setDate(NewTaskDueDate.getDate() + 1);
    const body = { dueDate: NewTaskDueDate };
    try {
      const response = await fetch("/api/task/" + task._id, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      console.log(response.status);
    } catch (error) {
      console.log(error);
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
        console.log(daysRemainingFromSpillOver);
        console.log(task._id);
      }}
    >
      <div
        key={task._id + index}
        // onClick={() => console.log(calculateTop())}
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
         } 
         ${goesAcross && "border-r-0"}
         ${doesTaskRunThrough && "rounded-r-none"}
         ${doesNotStartOnDay && "rounded-l-none border-l-0 "}
         ${
           taskHoverStatusObj?.[task._id]
             ? "border-accent-blue"
             : "border-border-default"
         }  `}
          onClick={() =>
            console.log(
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

          {/* <div className="flex [&>button]:mx-4 [&>button]:border [&>button]:px-4">
            <button onClick={() => setTop(0)}>reset top</button>
            <button onClick={handleUpdateTask}>change name</button>
            <button onClick={handleTaskDateChange}>change date</button>
          </div> */}
          <i onClick={handleDeleteTask} className="px-4 hover:border">
            <AiOutlineDelete />
          </i>
        </div>
      </div>
    </div>
  );
};

export default CalendarTaskBar;
