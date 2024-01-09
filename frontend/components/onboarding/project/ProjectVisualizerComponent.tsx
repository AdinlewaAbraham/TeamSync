import { ProjectViewType } from "@/app/project/new/page";
import React from "react";
import BoardProjectVisualizerComponent from "./boardVisualizer/BoardProjectVisualizerComponent";
import CalendarProjectVisualizerComponent from "./calendarVisualizer/CalendarProjectVisualizerComponent";
import TableProjectVisualizerComponent from "./tableVisualizer/TableProjectVisualizerComponent";
import TimelineProjectVisualizerComponent from "./TimelineVisualizer/TimelineProjectVisualizerComponent";

const ProjectVisualizerComponent = ({
  projectName,
  projectDefaultView,
  setProjectDefaultView,
}: {
  projectName: string;
  projectDefaultView: ProjectViewType;
  setProjectDefaultView: (c: ProjectViewType) => void;
}) => {
  const renderVisualizerComponent = (projectViewType: ProjectViewType) => {
    switch (projectViewType) {
      case "board":
        return <BoardProjectVisualizerComponent />;
      case "calendar":
        return <CalendarProjectVisualizerComponent />;
      case "table":
        return <TableProjectVisualizerComponent />;
      case "timeline":
        return <TimelineProjectVisualizerComponent />;
    }
  };
  return (
    <div className="mr-16 flex h-[550px] min-h-[500px] w-full max-w-5xl flex-1 select-none flex-col rounded-lg border-2 border-border-default">
      <header className="flex h-16 items-center justify-between border-b border-border-default px-4">
        <div className="flex h-full items-center">
          <div className="mr-4 h-10 w-10 rounded-lg bg-border-default" />
          <div className="flex h-full flex-col justify-end">
            <span className="max-w-lg truncate text-ellipsis font-medium">
              {projectName}
            </span>
            <div className="flex">
              {[
                "home",
                "board",
                "table",
                "calendar",
                "timeline",
                "dashboard",
              ].map((navitem) => {
                const isActiveNavItem = navitem === projectDefaultView;
                return (
                  <div
                    className={`${
                      isActiveNavItem
                        ? "navbarBorderB text-"
                        : "text-muted-dark"
                    } ml-4 cursor-default pb-1.5 pt-1 text-sm font-medium first:ml-0 `}
                  >
                    {navitem[0].toUpperCase() + navitem.substring(1)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex h-full items-center gap-1">
          <div className="h-6 w-6 rounded-full bg-border-default" />
          <div className="h-6 w-6 rounded-full bg-border-default" />
          <div className="h-6 w-6 rounded-full bg-border-default" />
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        {renderVisualizerComponent(projectDefaultView)}
      </div>
    </div>
  );
};

export default ProjectVisualizerComponent;
