import { useGlobalContext } from "@/context/GeneralContext";
import { redirectToLogin } from "@/helpers/redirect";
import Section from "@/interfaces/section";
import Task from "@/interfaces/task";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import findMinFreeRowNumber from "@/utilis/findMinFreeRowNumber";
import React, { useEffect, useState, MouseEvent } from "react";
import { RiDraggable } from "react-icons/ri";

const HorizontalRowsForTaskMapping = ({
  index,
  projectId,
  setSelectedDateObject,
  month,
  year,
  taskWithDateRange,
  sectionTasks,
  section,
}: {
  index: number;
  projectId: string;
  setSelectedDateObject: (c: { startDate: Date; endDate: Date } | null) => void;
  month: number;
  year: number;
  taskWithDateRange: (string | Task | undefined)[];
  sectionTasks: (Task | undefined | string)[];
  section: Section;
}) => {
  const { activeProject, setActiveProject } = useGlobalContext();
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
    [],
  );
  useEffect(() => {
    const tasksToMapuseEffect: (string | Task | undefined)[] =
      sectionTasks.filter((task) => {
        if (typeof task !== "object") return false;
        if (!task?.dateToStart) return false;
        const dateToStart = new Date(task.dateToStart);
        return (
          index === task.rowNumber &&
          month === dateToStart.getMonth() &&
          year === dateToStart.getFullYear()
        );
      });
    setTasksToMap(tasksToMapuseEffect);
  }, [sectionTasks]);
  const handleAddTask = async (day: number) => {
    setShowInput(false);

    if (!projectId || !taskName || !day) return;

    if (
      typeof activeProject?.sections[0] !== "object" ||
      !activeProject?.sections
    )
      return;
    const startDay: Date = new Date(year, month, day);
    const lastDay: Date = new Date(startDay);
    lastDay.setDate(lastDay.getDate() + noOfDaysToAdd);
    const postBody = {
      taskName,
      projectId,
      sectionId: section._id,
      dateToStart: startDay,
      dueDate: lastDay,
      rowNumber: index,
    };
    const response = await fetch("/api/task/", {
      method: "POST",
      body: JSON.stringify(postBody),
    });
    setTaskName("");

    const data = await response.json();

    await redirectToLogin(response.status, data?.error);
    if (response.ok) {
      setTasksToMap([...tasksToMap, data as Task]);
      // const newActiveProject = {...activeProject, sections:  }
    } else {
      console.log("something went wrong");
    }
  };
  const handleRowClick = (event: MouseEvent) => {
    // console.log(index);
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const dayColumnWidth = 40;
    const clickedDayIndex = Math.floor(offsetX / dayColumnWidth);
    const day = new Date(year, month, clickedDayIndex + 1);
    // console.log(day.setHours(day.getHours() + 26));
    // console.log(day.getHours());
    setcurrentDay(clickedDayIndex + 1);

    // check if the day clicked on has anything if yes dont render input if no calc nearest task and what day it is to determine inout width and span

    const allTasksOnColum = sectionTasks.filter((task) => {
      if (typeof task !== "object") return false;
      return index === task.rowNumber;
    });
    const taskOnDay = allTasksOnColum.find((task) => {
      if (typeof task !== "object") return;
      const dueDate = new Date(task.dueDate);
      const dateToStart = new Date(task.dateToStart);
      return dueDate >= day && dateToStart <= day;
    });

    console.log(taskOnDay);
    if (!taskOnDay) {
      console.log("is going to show");
      const firstTaskAfterDay = tasksToMap.find((task) => {
        if (typeof task !== "object") return false;
        return new Date(task.dateToStart) > new Date(day);
      });
      let daysToAdd = 4;

      if (firstTaskAfterDay) {
        if (typeof firstTaskAfterDay !== "object") return;
        const firstTaskAfterDayDate = new Date(firstTaskAfterDay.dateToStart);
        daysToAdd = calculateDaysBetweenDates(day, firstTaskAfterDayDate) - 2;
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
  };
  return (
    <div
      key={index}
      className=" relative z-[99] flex h-12 w-full cursor-cell items-center"
      onClick={handleRowClick}
    >
      {/* <p className="absolute left-[50%]">{index + 1}</p> */}
      {showInput && (
        <div
          style={{
            left: `${inputRectData.left}px`,
            width: `${inputRectData.width}px `,
          }}
          className="absolute px-1"
        >
          <input
            className=" z-50 h-9 w-full rounded-lg border border-border-default bg-bg-primary
             pl-2 text-xs placeholder:text-muted-dark focus-visible:outline-none "
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
        </div>
      )}
      {tasksToMap.map((task, index) => {
        if (typeof task !== "object") return;

        const startDate = new Date(task.dateToStart);
        const endDate = new Date(task.dueDate);
        const width = calculateDaysBetweenDates(startDate, endDate) * 40;
        return (
          <div
            key={task._id}
            className="absolute flex h-full cursor-pointer items-center px-1 py-2"
            style={{
              left: `${(new Date(task.dateToStart).getDate() - 1) * 40}px`,
              width: width + "px",
              opacity: width < 0 ? 1 : 1,
            }}
            onClick={() => {}}
          >
            <div
              className="[&>div]: [&>div]: [&>div]: group relative flex h-9 w-full items-center overflow-hidden rounded-lg border border-border-default
              bg-bg-primary text-xs transition-all duration-150 hover:border-accent-blue [&>div]:hidden
             [&>div]:h-full [&>div]:items-center [&>div]:justify-center [&>div]:bg-accent-blue [&>div]:transition-all [&>div]:duration-150"
            >
              <div className="left-0 cursor-w-resize group-hover:flex">
                <RiDraggable />
              </div>
              <span
                className="flex h-full flex-1 items-center truncate text-ellipsis pl-2"
                draggable
              >
                {task.taskName}
              </span>
              <div className="right-0 cursor-e-resize group-hover:flex">
                <RiDraggable />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HorizontalRowsForTaskMapping;
