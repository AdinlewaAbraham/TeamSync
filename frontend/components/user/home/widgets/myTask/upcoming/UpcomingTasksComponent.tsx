import Task from "@/interfaces/task";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import UpcomingTaskCard from "./UpcomingTaskCard";

const UpcomingTasksComponent = () => {
  const task: Task = {
    _id: "652ea2c856c7c663833733fswsw7",
    taskName: "fssasfff",
    assignees: [],
    dueDate: new Date("2023-10-04T23:00:00.000Z"),
    dateToStart: new Date("2023-10-02T23:00:00.000Z"),
    Priority: "null",
    status: "null",
    comments: [],
    subTasks: [],
    members: [],
    projectId: "64ee7b4ed85897sas0d2df1bfc9",
    sectionId: "652ea17ssxed56c7c663833733b8",
    description: "shxwxwxit",
    isComplete: false,
    rowNumber: 4,
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto ">
      <div className="px-6">
        <div className=" w-full border-b border-border-default py-2 text-xs text-muted-dark ">
          <button className="flex items-center rounded-md p-1 px-2 transition-all duration-150 hover:bg-menuItem-active">
            <i className="mr-1 text-base">
              <IoMdAdd />
            </i>
            Create task
          </button>
        </div>
      </div>
      <div className="relative flex-1">
        <div className="absolute inset-0 overflow-y-auto">
          {Array(20)
            .fill(task)
            .map((task: Task) => (
              <UpcomingTaskCard task={task} key={task._id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingTasksComponent;
