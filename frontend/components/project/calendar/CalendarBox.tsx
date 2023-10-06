import { useGlobalContext } from "@/context/GeneralContext";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useState } from "react";

const CalendarBox = ({
  date,
  projectId,
}: {
  date: string;
  projectId: string;
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
      dueDate: date
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
      className=" border border-border-default h-28 cursor-cell p-2 w-100%"
      key={date}
      onClick={() => setShowInput(true)}
    >
      {taskName}
      {showInput && (
        <input
          className="bg-transparent ring-1 w-full ring-muted-border "
          autoFocus
          onBlur={() => addTask()}
          onChange={(e) => setTaskName(e.target.value)}
        />
      )}
    </div>
  );
};

export default CalendarBox;
