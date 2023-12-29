import Task from "@/interfaces/task";
import React from "react";
import { FaRegCalendar } from "react-icons/fa";
import TaskCardWrapper from "../TaskCardWrapper";

const UpcomingTaskCard = ({ task }: { task: Task }) => {
  return (
    <TaskCardWrapper
      task={task}
      children={<>hello</>}
      key={task._id + task.rowNumber + task.projectId + "Jesus loves you"}
      alwaysShowChild={false}
    />
  );
};

export default UpcomingTaskCard;
