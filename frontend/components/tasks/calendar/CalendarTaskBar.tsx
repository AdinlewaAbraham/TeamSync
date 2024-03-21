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
import {
  days,
  hideWeekendDayWidth,
  properlyIndexedDays,
} from "@/constants/calendar";
import { InputTaskPropObject, useCalendarStore } from "@/store/calendarStore";
import { calculateTop } from "@/utilis/calculateTop";
import { taskbarHeight } from "@/constants/taskBar";
import { isSameDay } from "@/utilis/isSameDay";
import CalendarBoxInput from "./CalendarBoxInput";
import Project from "@/interfaces/project";
import { Timeframe } from "@/interfaces/timeframe";
import doDateFallWithinTimeframe from "@/utilis/doDateFallWithinTimeframe";
import { isWeekend } from "@/utilis/isWeekend";
import { getWeekendCountInTaskTimrframe } from "@/utilis/getWeekendCountInTaskTimrframe";

type Props = {
  index: number;
  task: Task;
  isLast: boolean;
  calendarBoxDate: Date;
  boxWidth: number;
  tasksInRow: (Task | InputTaskPropObject)[];
  calendarRowTaskPositionObject: CalendarRowTaskPositionObject;
  projectId: string;
  project: Project | null;
  rowTimeframe: Timeframe;
};
const CalendarTaskBar: React.FC<Props> = ({
  index,
  task,
  isLast,
  calendarBoxDate,
  boxWidth,
  tasksInRow,
  calendarRowTaskPositionObject,
  projectId,
  project,
  rowTimeframe,
}) => {
  const {
    setTaskHoverStatusObj,
    taskHoverStatusObj,
    calendarTaskbarHoverStatusObj,
  } = useGlobalContext();

  const { showWeekend } = useCalendarStore();

  const [top, setTop] = useState(0);
  const [showCheckMark, setShowCheckMark] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  const taskDateToStart = new Date(task.dateToStart);
  const taskDueDate = new Date(task.dueDate);

  const doesNotStartOnDay = !isSameDay(taskDateToStart, calendarBoxDate);

  const isInput = task._id === "input";

  const dateIndex = properlyIndexedDays.findIndex(
    (day) =>
      days[taskDateToStart.getDay()].substring(0, 3).toLowerCase() ===
      day.substring(0, 3).toLowerCase(),
  );

  const numOfDaysInTaskDateRange = useMemo(
    () =>
      calculateDaysBetweenDates(
        new Date(task.dateToStart),
        new Date(task.dueDate),
      ),
    [task.dateToStart, task.dueDate],
  );
  const noOfDaysToEnd = 7 - dateIndex;
  const hasOverflowToRight = numOfDaysInTaskDateRange > noOfDaysToEnd;
  const widthForTasksWithOverflowToRight = hasOverflowToRight
    ? Math.max(noOfDaysToEnd, 1)
    : Math.max(numOfDaysInTaskDateRange, 1);

  const daysRemainingFromSpillOver = useMemo(
    () =>
      calculateDaysBetweenDates(
        new Date(calendarBoxDate),
        new Date(task.dueDate),
      ),
    [JSON.stringify(calendarBoxDate), JSON.stringify(task.dueDate)],
  );

  const doesTaskRunThrough = daysRemainingFromSpillOver > 7; // if tasks spans through the week
  const widthForTasksThatDoesNotStartOnDay = Math.min(
    7,
    daysRemainingFromSpillOver,
  );

  const isInFirstDayInDaysArr =
    days[0].substring(0, 3).toLowerCase() ===
    properlyIndexedDays[calendarBoxDate.getDay()].substring(0, 3).toLowerCase();

  const tasksInRowDateMapping = useMemo(
    () =>
      tasksInRow.map((task) => {
        if (typeof task !== "object") return task;
        return {
          dueDate: task?.dueDate,
          dateToStart: task?.dateToStart,
        };
      }),
    [JSON.stringify(tasksInRow)],
  );

  useEffect(() => {
    const newTop = calculateTop(
      task,
      index,
      isInFirstDayInDaysArr,
      calendarRowTaskPositionObject,
    );

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

  useEffect(() => {
    const handleMouseTaskbarEnter = () => {
      setIsHovered(true);
    };
    const handleMouseTaskbarLeave = () => {
      setIsHovered(false);
    };
    document.addEventListener("mouseEnter" + task._id, handleMouseTaskbarEnter);
    document.addEventListener("mouseLeave" + task._id, handleMouseTaskbarLeave);

    return () => {
      document.removeEventListener(
        "mouseEnter" + task._id,
        handleMouseTaskbarEnter,
      );
      document.removeEventListener(
        "mouseLeave" + task._id,
        handleMouseTaskbarLeave,
      );
    };
  }, []);

  const handleMouseEnter = () => {
    if (isInput) return;

    const taskbarMouseEnterEvent = new CustomEvent("mouseEnter" + task._id, {});
    document.dispatchEvent(taskbarMouseEnterEvent);

    setShowCheckMark(true);
  };
  const handleMouseLeave = () => {
    if (isInput) return;

    const taskbarMouseLeaveEvent = new CustomEvent("mouseLeave" + task._id, {});
    document.dispatchEvent(taskbarMouseLeaveEvent);

    setShowCheckMark(false);
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

  const taskTimeframe = {
    dateToStart: calendarBoxDate,
    dueDate:
      taskDueDate.getTime() < new Date(rowTimeframe.dueDate).getTime()
        ? taskDueDate
        : rowTimeframe.dueDate,
  };

  const taskbarContainerAdditionalClasses = [
    hasOverflowToRight && !doesNotStartOnDay && "pr-0",
    doesTaskRunThrough && "pr-0",
    doesNotStartOnDay && "pl-0",
  ].filter(Boolean);

  const taskbarAdditionalClasses = [
    !isLast && "mb-1",
    hasOverflowToRight && !doesNotStartOnDay && "rounded-r-none border-r-0",
    doesTaskRunThrough && "border-r-0",
    doesTaskRunThrough && "rounded-r-none",
    doesNotStartOnDay && "rounded-l-none border-l-0",
    !isInput && "px-3 py-1 hover:border-accent-blue",
    isHovered ? "border-accent-blue" : "border-border-default",
  ].filter(Boolean);

  const widthMultiplier = doesNotStartOnDay
    ? widthForTasksThatDoesNotStartOnDay
    : widthForTasksWithOverflowToRight;

  const taskbarWidth = widthMultiplier * boxWidth;

  const WeekendCountInTaskTimrframe = useMemo(
    () => getWeekendCountInTaskTimrframe(taskTimeframe),
    [JSON.stringify(taskTimeframe)],
  );

  const weekendBoxCutoffWidth =
    (boxWidth - hideWeekendDayWidth) * WeekendCountInTaskTimrframe;
  const weekendWidthReducer = showWeekend ? 0 : weekendBoxCutoffWidth;
  return (
    <div
      onClick={() => {
        console.log(noOfDaysToEnd);
        console.log(hasOverflowToRight);
        console.log(showWeekend ? 0 : weekendBoxCutoffWidth);
      }}
      className="taskBar" // do not remove classname "taskbar"
    >
      <div
        key={task._id + index}
        style={{
          width: `calc(${taskbarWidth}px - ${weekendWidthReducer}px)`,
          ...(top > 192 - 36 ? { color: "red", top: top } : { top: top }),
        }}
        className={`absolute z-50 px-2 ${taskbarContainerAdditionalClasses.join(
          " ",
        )} `}
      >
        <div
          key={task._id}
          className={` group z-50 flex w-full cursor-pointer items-center rounded-lg 
          border-2 bg-bg-secondary text-xs transition-colors duration-150 
          ${taskbarAdditionalClasses.join(" ")}`}
          style={{
            height: taskbarHeight,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          draggable
          onDragStart={dragStart}
        >
          {isInput ? (
            <CalendarBoxInput
              autoFocus={isSameDay(calendarBoxDate, task.dateToStart)}
              projectId={projectId}
              task={task}
              project={project}
            />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarTaskBar;
