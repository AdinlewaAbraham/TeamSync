import { useGlobalContext } from "@/context/GeneralContext";
import { redirectToLogin } from "@/helpers/redirect";
import Task from "@/interfaces/task";
import React, { useEffect, useState } from "react";

const TimelineVerticalBars = ({
  day,
  setSelectedDateObject,
  projectId,
  taskWithDateToStart,
  minHeight,
}: {
  day: Date;
  setSelectedDateObject: (c: { startDate: Date; endDate: Date } | null) => void;
  projectId: string;
  taskWithDateToStart: (string | Task | undefined)[];
  minHeight: number;
}) => {
  const { activeProject } = useGlobalContext();
  const [showInput, setShowInput] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const handleAddTask = async () => {
    setShowInput(false);
    setShowInput(false);

    if (!projectId || !taskName || !day) return;

    if (
      typeof activeProject?.sections[0] !== "object" ||
      !activeProject?.sections
    )
      return;
    const lastDay: Date = new Date(day);
    lastDay.setDate(lastDay.getDate() + 4);
    const postBody = {
      taskName,
      projectId,
      sectionId: activeProject.sections[0]._id,
      dateToStart: day,
      dueDate: lastDay,
    };
    const response = await fetch("/api/task/", {
      method: "POST",
      body: JSON.stringify(postBody),
    });
    setTaskName("");

    const data = await response.json();

    await redirectToLogin(response.status, data?.error);
    if (response.ok) {
      // update localtasks
    } else {
      console.log("something went wrong");
    }
  };
  const [tasksToMap, setTasksToMap] = useState<(string | Task | undefined)[]>(
    [],
  );
  function areDatesEqual(date1: Date, date2: Date) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }
  useEffect(() => {
    const tasksToMapuseEffect: (string | Task | undefined)[] =
      taskWithDateToStart.filter((task) => {
        if (typeof task !== "object") return false;
        if (!task?.dateToStart) return false;
        return day.toUTCString() === new Date(task.dateToStart).toUTCString();
      });
    setTasksToMap(tasksToMapuseEffect);
  }, [taskWithDateToStart]);

  useEffect(() => {}, []);
  const isToday = new Date().toUTCString() === new Date(day).toUTCString();
  if (isToday) {
    console.log(day);
  }
  return (
    <div
      key={day.getUTCSeconds()}
      className={`relative h-full w-[40px] ${
        (day.getDay() === 0 || day.getDay() === 6) && "bg-[#2a2b2d]"
      } `}
      style={{ minHeight: minHeight }}
    >
      {isToday && (
        <div className="absolute left-0 z-50 h-10 w-1 bg-green-500" />
      )}
    </div>
  );
};

export default TimelineVerticalBars;
