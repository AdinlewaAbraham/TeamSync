import Task from "@/interfaces/task";
import React from "react";
import UpcomingTaskCard from "../upcoming/UpcomingTaskCard";

const OverdueTasksComponent = () => {
  const tasks: Task[] = [
    {
      _id: "652ea2c856c7c663833733f7",
      taskName: "fffff",
      assignees: [],
      dueDate: new Date("2023-10-04T23:00:00.000Z"),
      dateToStart: new Date("2023-10-02T23:00:00.000Z"),
      Priority: "null",
      status: "null",
      comments: [],
      subTasks: [],
      members: [],
      projectId: "64ee7b4ed858970d2df1bfc9",
      sectionId: "652ea17d56c7c663833733b8",
      description: "shit",
      isComplete: false,
      rowNumber: 4,
    },
  ];
  return (
    <div className="flex flex-1">
      <div className="relative flex-1">
        <div className="absolute inset-0 overflow-y-auto">
          {Array(20)
            .fill(tasks[0])
            .map((task: Task) => (
              <UpcomingTaskCard task={task} key={task._id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default OverdueTasksComponent;
