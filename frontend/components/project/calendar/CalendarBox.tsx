import { useGlobalContext } from "@/context/GeneralContext";
import { redirectToLogin } from "@/helpers/redirect";
import Task from "@/interfaces/task";
import React, { useState } from "react";
import TaskBar from "./TaskBar";

const CalendarBox = ({
  date,
  projectId,
  isNotinMonth,
  index,
  taskWithDueDate,
}: {
  date: Date;
  projectId: string;
  isNotinMonth: boolean;
  index: number;
  taskWithDueDate: (string | Task | undefined)[];
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [showCheckMark, setShowCheckMark] = useState<boolean>(false);

  const { activeProject } = useGlobalContext();
  const addTask = async () => {
    setShowInput(false);

    if (!projectId || !taskName || !date) return;

    if (
      typeof activeProject?.sections[0] !== "object" ||
      !activeProject?.sections
    )
      return;
    const postBody = {
      taskName,
      projectId,
      sectionId: activeProject.sections[0]._id,
      dueDate: date,
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

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = new Date();

  const isToday =
    currentDate.getFullYear() === date.getFullYear() &&
    currentDate.getMonth() === date.getMonth() &&
    currentDate.getDate() === date.getDate();

  const tasks = taskWithDueDate.filter((task) => {
    if (typeof task !== "object") return;
    const taskDueDate = new Date(task.dueDate);
    return taskDueDate.toISOString() === date.toISOString();
  });

  return (
    <div
      id={isToday ? "today" : index.toString()}
      className={`relative border border-border-default border-b-0 h-48 cursor-cell p-2 w-full ${
        (index + 1) % 7 === 0 ? "border-r" : "border-r-0"
      } ${index % 7 !== 0 ? "border-l" : "border-l-0"} ${
        index <= 6 ? "border-t-0" : "border-t"
      } `}
      key={date.toString()}
      onClick={() => {
        setShowInput(true);
        console.log(date);
      }}
    >
      <div
        className={` max-w-max mb-1 p-2 h-7 flex justify-center items-center  ${
          isNotinMonth && "text-muted-dark"
        } ${isToday && "bg-accent-blue rounded-lg"} `}
      >
        {date.getDate() === 1 && <>{months[date.getMonth()].substring(0, 3)}</>}
        {date.getDate()}
      </div>
      {tasks.map((task, index) => {
        if (typeof task !== "object") return;
        const isLast = tasks.length - 1 === index;
        return <TaskBar task={task} isLast={isLast} />;
      })}
      {showInput && (
        <input
          className={`${
            tasks.length > 0 && "mt-1"
          } bg-transparent text-input w-full border-2 border-border-default text-sm focus:ring-0 flex items-center`}
          autoFocus
          onBlur={() => addTask()}
          onChange={(e) => setTaskName(e.target.value)}
        />
      )}
    </div>
  );
};

export default CalendarBox;
