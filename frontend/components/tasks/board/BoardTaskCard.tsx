import Task from "@/interfaces/task";
import React, { useState } from "react";
import RenderStatus, { RenderPriority } from "../ConditionalRender";

const BoardTaskCard = ({ task }: { task: Task }) => {
  const [localTask, setLocalTask] = useState<Task>(task);

  return (
    <li>
      <div className="mb-2 px-2 ">
        <div
          className=" flex cursor-pointer  flex-col rounded-lg border
       border-border-default px-2 py-4 hover:bg-menuItem-hover"
        >
          <p className="mb-4 leading-none"> {localTask.taskName}</p>
          <div className="flex items-center ">
            <div className=" [&>div]: [&>div]: flex items-center text-black [&>div]:rounded-xl [&>div]:text-sm">
              <div className="mr-1 [&>div]:mb-4 [&>div]:rounded-xl [&>div]:px-2 [&>div]:text-xs">
                <RenderPriority Priority={localTask.Priority} />
              </div>

              <div className="[&>div]:mb-4 [&>div]:rounded-xl [&>div]:px-2 [&>div]:text-xs">
                <RenderStatus status={localTask.status} />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-5 w-5 rounded-full bg-slate-600" />
            <div className="text-xs text-muted-light">today - sep 19</div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BoardTaskCard;
