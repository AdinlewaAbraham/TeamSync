import { useGlobalContext } from "@/context/GeneralContext";
import { fetchAndHelpRedirect } from "@/helpers/redirect";
import Section from "@/interfaces/section";
import Task from "@/interfaces/task";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import findMinFreeRowNumber from "@/utilis/findMinFreeRowNumber";
import React, {
  useEffect,
  useState,
  MouseEvent,
  DragEvent,
  useMemo,
} from "react";
import { RiDraggable } from "react-icons/ri";
import TimelineTaskBar from "./TimelineTaskBar";

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
  const [blankDropTaskRenderObject, setBlankDropTaskRenderObject] = useState<{
    show: boolean;
    left: number;
    width: number;
  }>();
  const tasksToMapuseEffect: (string | Task | undefined)[] = useMemo(
    () =>
      sectionTasks.filter((task) => {
        if (typeof task !== "object") return false;
        if (!task?.dateToStart) return false;
        const dateToStart = new Date(task.dateToStart);
        return (
          index === task.rowNumber &&
          month === dateToStart.getMonth() &&
          year === dateToStart.getFullYear()
        );
      }),
    [sectionTasks],
  );
  // const [lastSavedIndex, setLastSavedIndex] = useState(-1);
  useEffect(() => {
    setTasksToMap(tasksToMapuseEffect);
  }, [tasksToMapuseEffect]);
  const handleAddTask = async (day: number) => {
    setShowInput(false);

    if (!projectId || !taskName || !day) return;

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
    const {data, _response} = await fetchAndHelpRedirect("/api/task/", {
      method: "POST",
      body: JSON.stringify(postBody),
    });
    setTaskName("");


    if (_response.ok) {
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
  const allowDrop = (e: DragEvent) => {
    if (e) e.preventDefault();
    // stuff that hanldes effects hover drop effect in calendaBox like adding _blank to component
    if (e.dataTransfer) {
      const data = sessionStorage.getItem("timelineDragTask");
      const taskToBeMovedJson: Task = data ? JSON.parse(data) : null;
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const hoverDayIndex = Math.floor(offsetX / 40);
      if (taskToBeMovedJson) {
        console.log(taskToBeMovedJson);
        const { dueDate, dateToStart } = taskToBeMovedJson;
        const newBlankDropTaskRenderObject = {
          left: hoverDayIndex * 40,
          show: true,
          width:
            calculateDaysBetweenDates(
              new Date(dateToStart),
              new Date(dueDate),
            ) * 40,
        };
        setBlankDropTaskRenderObject(newBlankDropTaskRenderObject);
        const newSelectedDateObject = {
          startDate: new Date(dateToStart),
          endDate: new Date(dueDate),
        };
        setSelectedDateObject(newSelectedDateObject);
      }
    }
    console.log("i should be calculating and sorting and appending stuff");
  };
  const drop = (e: DragEvent) => {
    e.preventDefault();
    console.log(e.target);
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain");
      console.log(JSON.parse(data));
    }
    setBlankDropTaskRenderObject({ left: 0, show: true, width: 80 });
    setSelectedDateObject(null);
  };
  const dragLeave = () => {
    console.log("i should be doing clean p");
    setBlankDropTaskRenderObject({ left: 0, show: false, width: 0 });
    setSelectedDateObject(null);
    // setLastSavedIndex(-1);
  };
  return (
    <div
      key={index}
      className=" relative z-40 flex h-12 w-full cursor-cell items-center"
      onClick={handleRowClick}
      onDragOver={allowDrop}
      onDrop={drop}
      onDragLeave={dragLeave}
    >
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
        // if (task?.type === "_blank") return <></>;
        return <TimelineTaskBar task={task} key={task._id} />;
      })}
      {blankDropTaskRenderObject?.show && (
        <div
          className="absolute h-9 rounded-lg border border-blue-300 bg-gray-500"
          style={{
            left: blankDropTaskRenderObject.left + "px",
            width: blankDropTaskRenderObject.width + "px",
          }}
        />
      )}
    </div>
  );
};

export default HorizontalRowsForTaskMapping;
