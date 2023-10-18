import { useGlobalContext } from "@/context/GeneralContext";
import { redirectToLogin } from "@/helpers/redirect";
import Task from "@/interfaces/task";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import React, { useEffect, useState } from "react";

const HourHorizontalColums = ({
  time,
  index,
  projectId,
  setSelectedDateObject,
  month,
  year,
  taskWithDateRange,
}: {
  time: number;
  index: number;
  projectId: string;
  setSelectedDateObject: (c: { startDate: Date; endDate: Date } | null) => void;
  month: number;
  year: number;
  taskWithDateRange: (string | Task | undefined)[];
}) => {
  const { activeProject } = useGlobalContext();
  const [currentDay, setcurrentDay] = useState<number>(0);
  const [noOfDaysToAdd, setNoOfDaysToAdd] = useState<number>(4);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [inputRectData, setInputRectData] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });
  const [tasksToMap, setTasksToMap] = useState<(string | Task | undefined)[]>(
    []
  );

  useEffect(() => {
    const tasksToMapuseEffect: (string | Task | undefined)[] =
      taskWithDateRange.filter((task) => {
        if (typeof task !== "object") return false;
        if (!task?.dateToStart) return false;
        const dateToStart = new Date(task.dateToStart);
        return (
          index === dateToStart.getHours() &&
          month === dateToStart.getMonth() &&
          year === dateToStart.getFullYear()
        );
      });
    setTasksToMap(tasksToMapuseEffect);
  }, [taskWithDateRange]);
  const handleAddTask = async (day: number) => {
    setShowInput(false);
    setShowInput(false);

    if (!projectId || !taskName || !day) return;

    if (
      typeof activeProject?.sections[0] !== "object" ||
      !activeProject?.sections
    )
      return;
    const lastDay: Date = new Date(day);
    lastDay.setDate(lastDay.getDate() + noOfDaysToAdd);
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
  return (
    <div
      key={index}
      className="border-y border-border-default flex items-center h-[52px] w-full relative "
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const dayColumnWidth = 40;
        const clickedDayIndex = Math.floor(offsetX / dayColumnWidth);
        const day = new Date(year, month, clickedDayIndex + 1);
        // console.log(day.setHours(day.getHours() + 26));
        // console.log(day.getHours());
        setcurrentDay(clickedDayIndex + 1);

        // check if the day clicked on has anything if yes dont render input if no calc nearest task and what day it is to determine inout width and span

        const allTasksOnColum = taskWithDateRange.filter((task) => {
          if (typeof task !== "object") return false;
          if (!task?.dateToStart) return false;
          const dateToStart = new Date(task.dateToStart);
          return (
            index === dateToStart.getHours() 
          );
        });
        const taskOnDay = allTasksOnColum.find((task) => {
          if (typeof task !== "object") return;
          const dueDate = new Date(task.dueDate);
          const dateToStart = new Date(task.dateToStart);
          return dueDate >= day && dateToStart <= day;
        });
        if (!taskOnDay) {
          const firstTaskAfterDay = tasksToMap.find((task) => {
            if (typeof task !== "object") return false;
            return new Date(task.dateToStart) > new Date(day);
          });
          let daysToAdd = 4;

          if (firstTaskAfterDay) {
            if (typeof firstTaskAfterDay !== "object") return;
            const firstTaskAfterDayDate = new Date(
              firstTaskAfterDay.dateToStart
            );
            daysToAdd =
              calculateDaysBetweenDates(day, firstTaskAfterDayDate) - 2;
          }
          if (daysToAdd > 4 || daysToAdd < 0) {
            daysToAdd = 4;
          }
          setNoOfDaysToAdd(daysToAdd);
          const lastDay: Date = new Date(day);
          lastDay.setDate(lastDay.getDate() + daysToAdd);

          const selectedDateObject = { startDate: day, endDate: lastDay };
          setSelectedDateObject(selectedDateObject);
          setInputRectData({
            left: clickedDayIndex * dayColumnWidth,
            width: (daysToAdd + 1) * 40,
          });
          setShowInput(true);
        }
      }}
    >
      {/* <p className="absolute left-[50%]">{index + 1}</p> */}
      {showInput && (
        <input
          type="text"
          className="absolute  text-input z-50 w-[calc(40px*5)]"
          style={{
            left: `${inputRectData.left}px`,
            width: `${inputRectData.width}px `,
          }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            console.log(target);
          }}
          onBlur={() => {
            handleAddTask(currentDay);
            setSelectedDateObject(null);
          }}
          onChange={(e) => setTaskName(e.target.value)}
          autoFocus
          placeholder="Write a task name"
        />
      )}
      {tasksToMap.map((task, index) => {
        if (typeof task !== "object") return;

        const startDate = new Date(task.dateToStart);
        const endDate = new Date(task.dueDate);
        const width = calculateDaysBetweenDates(startDate, endDate) * 40;
        return (
          <div
            key={task._id}
            className="absolute flex items-center h-full py-2 cursor-pointer"
            style={{
              left: `${(new Date(task.dateToStart).getDate() - 1) * 40}px`,
              width: width + "px",
              opacity: width < 0 ? 1 : 1,
            }}
            onClick={() => {
              console.log(new Date(task.dateToStart).getDay());
              console.log(task);
            }}
            draggable
          >
            <div className="rounded-lg w-full h-9 border border-red-400 flex items-center pl-2">
              {task.taskName}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HourHorizontalColums;
