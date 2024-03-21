import Task from "@/interfaces/task";
import doTimeFramesOverlap from "./doTimeFramesOverlap";
import CalendarRowTaskPositionObject from "@/interfaces/calendarRowTaskPositionObject";
import { spacingBtwTaskbar, taskbarHeight } from "@/constants/taskBar";
import { Timeframe } from "@/interfaces/timeframe";

type TaskDetails = { _id: string; dateToStart: Date; dueDate: Date };
export const calculateTop = (
  task: TaskDetails,
  index: number,
  isInFirstDayInDaysArr: boolean,
  calendarRowTaskPositionObject: CalendarRowTaskPositionObject,
) => {
  const margin = index * spacingBtwTaskbar;
  const firstDayInDaysArrTop = index * taskbarHeight + margin;
  if (isInFirstDayInDaysArr) {
    return firstDayInDaysArrTop;
  }
  if (
    typeof calendarRowTaskPositionObject !== "object" ||
    Object.keys(calendarRowTaskPositionObject).length === 0
  ) {
    return 0;
  }

  const taskTimeFrame: Timeframe = {
    dateToStart: task.dateToStart,
    dueDate: task.dueDate,
  };

  for (let i = 0; ; i += taskbarHeight + spacingBtwTaskbar) {
    let isAvailable = true;

    for (const key in calendarRowTaskPositionObject) {
      const taskPositionObj = calendarRowTaskPositionObject[key];
      const currentTaskTimeFrame: Timeframe = {
        dateToStart: taskPositionObj.dateToStart,
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
