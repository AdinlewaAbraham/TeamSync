import Task from "@/interfaces/task";
import React from "react";
import { FaRegCalendar } from "react-icons/fa";
import TaskCardWrapper from "../TaskCardWrapper";

const UpcomingTaskCard = ({ task }: { task: Task }) => {
  return (
    <TaskCardWrapper
      task={task}
      key={task._id + task.rowNumber + task.projectId + "Jesus loves you"}
      alwaysShowChild={false}
    >
      <>hello</>
    </TaskCardWrapper>
  );
};

export default UpcomingTaskCard;
