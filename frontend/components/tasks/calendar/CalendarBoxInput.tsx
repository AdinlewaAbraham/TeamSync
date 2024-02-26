import {
  days,
  hideWeekendDayWidth,
  properlyIndexedDays,
} from "@/constants/calendar";
import { fetchAndHelpRedirect } from "@/helpers/redirect";
import CalendarRowTaskPositionObject from "@/interfaces/calendarRowTaskPositionObject";
import Project from "@/interfaces/project";
import { InputTaskPropObject, useCalendarStore } from "@/store/calendarStore";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import { calculateTop } from "@/utilis/calculateTop";
import doDateFallWithinTimeframe from "@/utilis/doDateFallWithinTimeframe";
import { isSameDay } from "@/utilis/isSameDay";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  autoFocus: boolean;
  task: InputTaskPropObject;
  projectId: string;
  project: Project | null;
};
const CalendarBoxInput: React.FC<Props> = ({
  autoFocus,
  task,
  projectId,
  project,
}) => {
  const {
    newTaskDuration,
    showWeekend,
    taskWithDateRange,
    setTaskWithDateRange,
    newTaskName,
    setNewTaskName,
  } = useCalendarStore();

  const removeInput = () => {
    setTaskWithDateRange(
      taskWithDateRange.filter((task) => task._id !== "input"),
    );
    setNewTaskName("")
  };
  const addTask = async () => {
    if (!projectId || !newTaskName) {
      removeInput();
      return;
    }

    const sectionId =
      typeof project?.sections[0] === "string"
        ? project?.sections[0]
        : project?.sections[0]._id;

    const postBody = {
      taskName: newTaskName,
      projectId,
      sectionId: sectionId,
      dateToStart: task.dateToStart,
      dueDate: task.dueDate,
    };
    const { _response, data, status } = await fetchAndHelpRedirect(
      "/api/task/",
      {
        method: "POST",
        body: JSON.stringify(postBody),
      },
    );

    removeInput();
    if (_response.ok) {
      // update localtasks
    } else {
      console.log("something went wrong");
    }
  };
  return (
    <input
      className={`text-input bgborder-inherit flex h-full w-full items-center rounded-none border-0 text-sm focus:ring-0 
     `}
      autoFocus={autoFocus}
      onBlur={addTask}
      value={newTaskName}
      onChange={(e) => setNewTaskName(e.target.value)}
    />
  );
};

export default CalendarBoxInput;
