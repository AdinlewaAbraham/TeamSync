import Task from "@/interfaces/task";
import calculateDaysBetweenDates from "@/utilis/calculateDaysBetweenDates";
import React, { DragEvent } from "react";
import { RiDraggable } from "react-icons/ri";

const TimelineTaskBar = ({ task }: { task: Task }) => {
  const startDate = new Date(task.dateToStart);
  const endDate = new Date(task.dueDate);
  const width = calculateDaysBetweenDates(startDate, endDate) * 40;

  const dragStart = (e: DragEvent) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", JSON.stringify(task));
      sessionStorage.setItem("timelineDragTask", JSON.stringify(task));
      console.log(e.dataTransfer.getData("text/plain"));
    }
  };

  const preventDragOver = (e: DragEvent) => {
    e.stopPropagation();
  };
  const preventDrop = (e: DragEvent) => {
    e.stopPropagation();
  };
  return (
    <div
      key={task._id}
      className="absolute z-50 flex h-full cursor-pointer items-center px-1 py-2"
      style={{
        left: `${(new Date(task.dateToStart).getDate() - 1) * 40}px`,
        width: width + "px",
        opacity: width < 0 ? 1 : 1,
      }}
      onClick={() => {}}
      onDragOver={preventDragOver}
      onDrop={preventDrop}
    >
      <div
        className="[&>div]: [&>div]: [&>div]: group relative flex h-9 w-full items-center overflow-hidden rounded-lg border border-border-default
      bg-bg-primary text-xs transition-all duration-150 hover:border-accent-blue [&>div]:hidden
     [&>div]:h-full [&>div]:items-center [&>div]:justify-center [&>div]:bg-accent-blue [&>div]:transition-all [&>div]:duration-150"
      >
        <div className="left-0 cursor-w-resize group-hover:flex">
          <RiDraggable />
        </div>
        <span
          className="flex h-full flex-1 items-center truncate text-ellipsis pl-2"
          draggable
          onDragStart={dragStart}
        >
          {task.taskName}
        </span>
        <div className="right-0 cursor-e-resize group-hover:flex">
          <RiDraggable />
        </div>
      </div>
    </div>
  );
};

export default TimelineTaskBar;
