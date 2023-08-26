import { useGlobalContext } from "@/context/GeneralContext";
import Link from "next/link";
import React from "react";

const ProjectMainSection = () => {
  const { activeWorkspace, user } = useGlobalContext();
  const projects = activeWorkspace?.projects;

  return (
    <div>
      {projects ? (
        <>
          {projects.length === 0 ? (
            <div className="px-4">
              <div className="p-2 flex flex-col justify-center">
                <p className="text-xs whitespace-normal">
                  create project to organize tasks and what not
                </p>
                <button>create project</button>
              </div>
            </div>
          ) : (
            <ul>
              {projects.map((project) => (
                <Link
                  href={"/workspace/" + project.workspaceId + "/" + project._id}
                >
                  <li
                    className=" flex items-center px-4 py-2 rounded-lg hover:bg-menuItem-hover cursor-pointer text-sm font-medium "
                    key={project._id}
                  >
                    <div className="w-5 h-5 bg-slate-500 rounded-lg mr-2" />
                    {project.projectName}
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>loading</>
      )}
    </div>
  );
};

export default ProjectMainSection;
