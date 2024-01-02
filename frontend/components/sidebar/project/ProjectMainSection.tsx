import LoadingThemeProvider from "@/components/loading/LoadingThemeProvider";
import { useGlobalContext } from "@/context/GeneralContext";
import Link from "next/link";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";

const ProjectMainSection = () => {
  const { activeWorkspace, user } = useGlobalContext();
  const projects = activeWorkspace?.projects;
  console.log(projects);
  const [showLoader, setShowLoader] = useState(true);
  return (
    <div>
      {
        projects ? (
          <>
            {projects.length === 0 ? (
              <div className="px-4">
                <div className="flex flex-col justify-center p-2">
                  <p className="whitespace-normal text-xs">
                    create project to organize tasks and what not
                  </p>
                  <button>create project</button>
                </div>
              </div>
            ) : (
              <ul>
                {projects.map((project) => (
                  <Link
                    href={"/project/" + project._id + "/home"}
                    key={project._id}
                  >
                    <li
                      className=" flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-menuItem-hover "
                      key={project._id}
                    >
                      <div className="mr-2 h-5 w-5 rounded-md bg-slate-500" />
                      {project.projectName}
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </>
        ) : (
          <LoadingThemeProvider>
            <div className="px-4">
              {["53443gbr", "53443gbevrr", "5344br"].map((key) => (
                <div className="flex items-center py-2 h-[36px]" key={key}>
                  <Skeleton
                    borderRadius={6}
                    height={20}
                    width={20}
                    className="mr-2 "
                  />
                  <Skeleton
                    borderRadius={4}
                    height={10}
                    width={134}
                    className=" "
                  />
                </div>
              ))}
            </div>
          </LoadingThemeProvider>
        )
      }
    </div>
  );
};

export default ProjectMainSection;
