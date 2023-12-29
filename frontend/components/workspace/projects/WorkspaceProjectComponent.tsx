import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import WorkspaceProjectCard from "./WorkspaceProjectCard";

const WorkspaceProjectComponent = () => {
  const { activeWorkspace } = useGlobalContext();
  if (activeWorkspace)
    return (
      <div className="w-full rounded-lg border border-border-default bg-bg-primary py-4 ">
        <header className="p-4">
          <h2 className="text-xl font-medium">Projects</h2>
        </header>
        <div>
          <div className="group flex cursor-pointer items-center rounded-lg px-4 py-2 hover:bg-menuItem-hover hover:[&>i]:border-white">
            <i className="mr-2 flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-muted-dark text-lg group-hover:text-white">
              <IoMdAdd />
            </i>
            <span className="text-sm text-muted-dark">New project</span>
          </div>
          {activeWorkspace.projects.map((project) => (
            <WorkspaceProjectCard project={project} key={project._id} />
          ))}
        </div>
      </div>
    );
};

export default WorkspaceProjectComponent;
