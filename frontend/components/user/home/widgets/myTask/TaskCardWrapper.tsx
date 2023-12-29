import React, { ReactNode } from "react";
import Task from "@/interfaces/task";
import { FaRegCalendar } from "react-icons/fa";

const TaskCardWrapper = ({
  task,
  children,
  alwaysShowChild,
}: {
  task: Task;
  children: ReactNode;
  alwaysShowChild: boolean;
}) => {
  return (
    <div className="h-9 px-6 transition-colors duration-150 hover:bg-menuItem-active">
      <div className="flex h-full items-center truncate whitespace-nowrap border-b border-border-default">
        <div role="button" className="mr-2">
          <FaRegCalendar />
        </div>
        <p className="flex max-w-full flex-1 truncate text-ellipsis whitespace-nowrap">
          {task.taskName}
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </p>
        {JSON.stringify(alwaysShowChild)}
        <div
          className={`ml-2 ${
            alwaysShowChild ? "block" : "hidden"
          } text-muted-dark transition-all duration-150 group-hover:block hover:text-inherit`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default TaskCardWrapper;
