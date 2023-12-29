import Task from "@/interfaces/task";
import React from "react";
import TaskCardWrapper from "../TaskCardWrapper";

const OverdueTaskCard = ({ task }: { task: Task }) => {
  return (
    <TaskCardWrapper
      task={task}
      children={<p className="text-red-300">Aug 21</p>}
      key={task._id + "overdue"}
      alwaysShowChild={true}
    />
  );
};

export default OverdueTaskCard;
