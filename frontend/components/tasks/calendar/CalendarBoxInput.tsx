import {
  days,
  hideWeekendDayWidth,
  properlyIndexedDays,
} from "@/constants/calendar";
import { fetchAndHelpRedirect } from "@/helpers/redirect";
import CalendarRowTaskPositionObject from "@/interfaces/calendarRowTaskPositionObject";
import Project from "@/interfaces/project";
import {
  CalendarInputBoxObjectType,
  useCalendarStore,
} from "@/store/calendarStore";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import { calculateTop } from "@/utilis/calculateTop";
import doDateFallWithinTimeframe from "@/utilis/doDateFallWithinTimeframe";
import { isSameDay } from "@/utilis/isSameDay";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  calendarBoxDate: Date;
  boxWidth: number;
  projectId: string;
  calendarRowTaskPositionObject: CalendarRowTaskPositionObject;
  tasksThatStartOnDayLength: number;
  project: Project | null;
};
const CalendarBoxInput: React.FC<Props> = ({
  calendarBoxDate,
  boxWidth,
  projectId,
  calendarRowTaskPositionObject,
  tasksThatStartOnDayLength,
  project,
}) => {
  const {
    newTaskDuration,
    showWeekend,
    setCalendarInputBoxObject,
    calendarInputBoxObject,
  } = useCalendarStore();

  const isFirstDayInDaysArrs =
    days.findIndex(
      (day) =>
        day.substring(0, 3).toLowerCase() ===
        properlyIndexedDays[calendarBoxDate.getDay()]
          .substring(0, 3)
          .toLowerCase(),
    ) === 0;

  const showInput =
    calendarInputBoxObject &&
    (isSameDay(calendarBoxDate, calendarInputBoxObject.startDate) ||
      (isFirstDayInDaysArrs &&
        doDateFallWithinTimeframe(
          {
            dateToStart: calendarInputBoxObject?.startDate,
            dueDate: calendarInputBoxObject?.dueDate,
          },
          calendarBoxDate,
        )));

  const newTaskDueDate = new Date(calendarBoxDate);
  newTaskDueDate.setDate(newTaskDueDate.getDate() + (newTaskDuration - 1));

  const doesNotStartOnDay =
    calendarInputBoxObject &&
    !isSameDay(calendarInputBoxObject.startDate, calendarBoxDate);

  const dateIndex = !calendarInputBoxObject
    ? 0
    : properlyIndexedDays.findIndex(
        (day) =>
          days[calendarInputBoxObject.startDate.getDay()]
            .substring(0, 3)
            .toLowerCase() === day.substring(0, 3).toLowerCase(),
      );
  const numOfDaysInTaskDateRange = useMemo(
    () =>
      !calendarInputBoxObject
        ? 0
        : calculateDaysBetweenDates(
            new Date(calendarInputBoxObject.startDate),
            new Date(calendarInputBoxObject.dueDate),
          ),
    [calendarInputBoxObject?.startDate, calendarInputBoxObject?.dueDate],
  );

  const daysRemainingFromSpillOver = useMemo(
    () =>
      !calendarInputBoxObject
        ? 0
        : calculateDaysBetweenDates(
            new Date(calendarBoxDate),
            new Date(calendarInputBoxObject.dueDate),
          ),
    [
      JSON.stringify(calendarBoxDate),
      JSON.stringify(calendarInputBoxObject?.dueDate),
    ],
  );

  const dayStringName = properlyIndexedDays[calendarBoxDate.getDay()];

  const isFirstDayInDaysArr =
    dayStringName.toLowerCase().substring(0, 3) ===
    days[0].toLowerCase().substring(0, 3);

  const doesTaskRunThrough =
    isFirstDayInDaysArr && daysRemainingFromSpillOver > 7;

  const noOfDaysToEnd = 7 - dateIndex;
  const hasOverflowToRight = numOfDaysInTaskDateRange > noOfDaysToEnd;

  const widthForTasksWithOverflowToRight = hasOverflowToRight
    ? noOfDaysToEnd * boxWidth
    : numOfDaysInTaskDateRange * boxWidth;

  const widthForTasksThatDoesNotStartOnDay =
    boxWidth * Math.min(7, daysRemainingFromSpillOver);

  const doesTaskStartOrEndOnWeekend =
    calendarInputBoxObject &&
    (calendarInputBoxObject.startDate.getDay() === 0 ||
      calendarInputBoxObject.startDate.getDay() === 6 ||
      calendarInputBoxObject.dueDate.getDay() === 0 ||
      calendarInputBoxObject.dueDate.getDay() === 6);

  const doesTaskStartAndEndOnWeekend = !calendarInputBoxObject
    ? false
    : calendarInputBoxObject.startDate.getDay() === 0 &&
      calendarInputBoxObject.dueDate.getDay() === 6;

  const weekendBoxCutoffWidth =
    (doesTaskStartAndEndOnWeekend && numOfDaysInTaskDateRange === 7) ||
    (doesNotStartOnDay && daysRemainingFromSpillOver >= 7)
      ? (boxWidth - hideWeekendDayWidth) * 2
      : doesTaskStartOrEndOnWeekend || hasOverflowToRight || doesNotStartOnDay
        ? boxWidth - hideWeekendDayWidth
        : 0;

  const inputWidth =
    (doesNotStartOnDay
      ? widthForTasksThatDoesNotStartOnDay
      : widthForTasksWithOverflowToRight) -
    (showWeekend ? 0 : weekendBoxCutoffWidth);

  const addTask = async () => {
    if (!projectId || !calendarInputBoxObject || !project || !calendarBoxDate)
      return;

    const postBody = {
      taskName: calendarInputBoxObject.taskName,
      projectId,
      sectionId: project?.sections[0]?._id,
      dateToStart: calendarBoxDate,
      dueDate: newTaskDueDate,
    };
    const { _response, data, status } = await fetchAndHelpRedirect(
      "/api/task/",
      {
        method: "POST",
        body: JSON.stringify(postBody),
      },
    );

    setCalendarInputBoxObject(null);

    if (_response.ok) {
      // update localtasks
    } else {
      console.log("something went wrong");
    }
  };
  const inputContainerAdditionalClasses = [
    hasOverflowToRight && !doesNotStartOnDay && "pr-0",
    doesTaskRunThrough && "pr-0",
    doesNotStartOnDay && "pl-0",
  ].filter(Boolean);

  const inputAdditionalClasses = [
    hasOverflowToRight && !doesNotStartOnDay && "rounded-r-none border-r-0",
    doesTaskRunThrough && "border-r-0",
    doesTaskRunThrough && "rounded-r-none",
    doesNotStartOnDay && "rounded-l-none border-l-0",
  ].filter(Boolean);

  const [top, setTop] = useState(0);
  const calculateTopTaskDetails = {
    _id: "input",
    dateToStart: calendarBoxDate,
    dueDate: newTaskDueDate,
  };
  useEffect(() => {
    if (!calendarInputBoxObject) return;
    const inputId = "input" //`${calendarBoxDate.getDate()}${calendarBoxDate.getMonth()}${calendarBoxDate.getFullYear()}`;
    const newTop = calculateTop(
      calculateTopTaskDetails,
      tasksThatStartOnDayLength,
      calendarBoxDate.getDay() === 0,
      calendarRowTaskPositionObject,
    );
    console.log(tasksThatStartOnDayLength);
    calendarRowTaskPositionObject[inputId] = {
      dateToStart: calendarInputBoxObject?.startDate,
      dueDate: calendarInputBoxObject?.dueDate,
      top: newTop,
    };
    setTop(newTop);
    return () => {
      delete calendarRowTaskPositionObject[inputId];
    };
  }, [JSON.stringify(calendarInputBoxObject), tasksThatStartOnDayLength]);

  return (
    showInput && (
      <div
        className={`taskBarInput absolute z-50 flex w-full items-center justify-center px-2 
        ${inputContainerAdditionalClasses.join(" ")}`} // do not remove classname "taskBarInput"
        style={{
          top,
          width: inputWidth,
        }}
      >
        {top}
        <input
          className={`text-input flex w-full items-center border-2 border-border-default bg-bg-secondary text-sm focus:ring-0 
          ${inputAdditionalClasses.join(" ")} `}
          autoFocus={!doesNotStartOnDay}
          onBlur={addTask}
          value={calendarInputBoxObject.taskName}
          onChange={(e) =>
            setCalendarInputBoxObject({
              ...calendarInputBoxObject,
              taskName: e.target.value,
            })
          }
        />
      </div>
    )
  );
};

export default CalendarBoxInput;
