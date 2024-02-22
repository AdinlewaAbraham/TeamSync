import Task from "@/interfaces/task";
import React from "react";
import TaskCardWrapper from "../TaskCardWrapper";

const OverdueTaskCard = ({ task }: { task: Task }) => {
  return (
    <TaskCardWrapper
      task={task}
      key={task._id + "overdue"}
      alwaysShowChild={true}
    >
      <p className="text-red-300">Aug 21</p>
    </TaskCardWrapper>
  );
};

export default OverdueTaskCard;
