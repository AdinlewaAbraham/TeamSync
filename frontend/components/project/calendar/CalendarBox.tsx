import { useGlobalContext } from "@/context/GeneralContext";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useState } from "react";

const CalendarBox = ({
  date,
  projectId,
  isNotinMonth,
  index,
}: {
  date: Date;
  projectId: string;
  isNotinMonth: boolean;
  index: number;
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");

  const { activeProject } = useGlobalContext();
  const addTask = async () => {
    setShowInput(false);

    if (!projectId || !taskName) return;

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

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = new Date();

  const isToday =
    currentDate.getFullYear() === date.getFullYear() &&
    currentDate.getMonth() === date.getMonth() &&
    currentDate.getDate() === date.getDate();

  return (
    <div
      id={isToday ? "today" : index.toString()}
      className={`border border-border-default border-b-0 h-48 cursor-cell p-2 w-full ${
        (index + 1) % 7 === 0 ? "border-r" : "border-r-0"
      } ${index % 7 !== 0 ? "border-l" : "border-l-0"} ${
        index <= 6 ? "border-t-0" : "border-t"
      } `}
      key={date.toString()}
      onClick={() => setShowInput(true)}
    >
      <div
        className={` max-w-max mb-1 p-2 h-7 flex justify-center items-center  ${
          isNotinMonth && "text-muted-dark"
        } ${isToday && "bg-blue-500 rounded-lg"} `}
      >
        {date.getDate()}
      </div>
      {showInput && (
        <input
          className="bg-transparent border w-full border-border-default px-2 text-sm h-9 flex items-center"
          autoFocus
          onBlur={() => addTask()}
          onChange={(e) => setTaskName(e.target.value)}
        />
      )}
    </div>
  );
};

export default CalendarBox;
