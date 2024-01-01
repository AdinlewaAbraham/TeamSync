import { useGlobalContext } from "@/context/GeneralContext";
import { redirectToLogin } from "@/helpers/redirect";
import Task from "@/interfaces/task";
import React, { useEffect, useRef, useState } from "react";

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
  const [showInput, setShowInput] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const handleAddTask = async () => {
    setShowInput(false);
    setShowInput(false);

    if (!projectId || !taskName || !day) return;

    const lastDay: Date = new Date(day);
    lastDay.setDate(lastDay.getDate() + 4);
    const postBody = {
      taskName,
      projectId,
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

  const isToday = areDatesEqual(new Date(), new Date(day));
  const verticalBarRef = useRef(null);

  // useEffect(() => {
  //   if (isToday && verticalBarRef.current) {
  //     (verticalBarRef.current as HTMLElement).scrollIntoView();
  //   }
  // }, [verticalBarRef.current, isToday]);
  return (
    <div
      key={day.getUTCSeconds()}
      className={`relative flex h-full w-[40px] justify-center ${
        (day.getDay() === 0 || day.getDay() === 6) && "bg-[#2a2b2d]"
      } `}
      style={{ minHeight: minHeight }}
      id={
        isToday
          ? "today"
          : day.getMonth() + day.getDate().toString() + day.getFullYear()
      }
      ref={verticalBarRef}
    >
      {isToday && <div className="h-full w-0.5 bg-green-500" />}
    </div>
  );
};

export default TimelineVerticalBars;
