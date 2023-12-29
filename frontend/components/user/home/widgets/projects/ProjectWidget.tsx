import { useGlobalContext } from "@/context/GeneralContext";
import Project from "@/interfaces/project";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";

const ProjectWidget = () => {
  const { activeWorkspace } = useGlobalContext();

  const ProjectCard = ({ project }: { project: Project }) => {
    return (
      <div className="mr-2 flex rounded-lg p-2 hover:bg-menuItem-active hover:[&>i]:flex">
        <div className="mr-4 h-12 w-12 rounded-lg bg-slate-500" />
        <div className="justify-center-center flex flex-1 flex-col">
          <h4 className="text-slate-200">{project.projectName}</h4>
          {project.isProjectPrivate && (
            <div className="text-muted-dark">Private</div>
          )}
        </div>
        <i
          className="hidden items-center justify-center p-2 hover:bg-menuItem-hover"
          role="button"
        >
          <BsThreeDots />
        </i>
      </div>
    );
  };
  return (
    <div className="px-6 pt-6">
      <header className="">
        <h3 className="text-xl font-medium">Projects</h3>
      </header>
      <div className="projectMembers grid gap-2 py-2">
        <div className="group flex items-center p-2 text-muted-dark hover:text-inherit">
          <div
            className="mr-2 flex h-12 w-12 items-center justify-center rounded-lg border
           border-dashed border-muted-dark text-lg group-hover:border-white hover:bg-menuItem-active"
          >
            <IoMdAdd />
          </div>
          <span>Create project</span>
        </div>
        {activeWorkspace &&
          activeWorkspace.projects.map((project) => (
            <ProjectCard project={project} key={project._id} />
          ))}
      </div>
    </div>
  );
};

export default ProjectWidget;
