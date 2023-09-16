"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { ReactNode, useEffect, useState } from "react";
import Project from "@/interfaces/project";
import Section from "@/interfaces/section";
import { IoMdArrowDropdown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import RenderStatus, { RenderPriority } from "@/components/ConditionalRender";
const TableDropdown = ({
  section,
  isLast,
}: {
  section: Section | string;
  isLast: boolean;
}) => {
  const [showMainComponent, setShowMainComponent] = useState(false);
  if (typeof section === "string") return <>loading component</>;
  return (
    <div className={`border border-border-default ${isLast && "rounded-b-lg"}`}>
      <header
        onClick={() => setShowMainComponent(!showMainComponent)}
        className="flex items-center cursor-pointer py-2 font-medium"
      >
        <i
          className={` px-2 ${
            !showMainComponent && "rotate-[-90deg]"
          } transition-transform duration-300  `}
        >
          <IoMdArrowDropdown />
        </i>
        <h1 className="">{section.sectionName}</h1>
      </header>
      <AnimatePresence>
        {showMainComponent && (
          <motion.main>
            {section.tasks.map((task) => {
              if (typeof task === "string") {
                return <>loading comp</>;
              } else {
                return (
                  <ul className="w-full flex justify-between [&>li]:w-[20%] border-t border-border-default [&>li]:py-2 text-sm">
                    <li className="pl-8">{task.taskName}</li>
                    <li>{"debo"}</li>
                    <li>sep - 17</li>
                    <li className="[&>div]:px-2 [&>div]:rounded-xl [&>div]:text-sm [&>div]:max-w-max">
                      <RenderPriority Priority={task.Priority} />
                    </li>
                    <li className="[&>div]:px-2 [&>div]:rounded-xl [&>div]:text-sm [&>div]:max-w-max ">
                      <RenderStatus status={task.status} />
                    </li>
                  </ul>
                );
              }
            })}
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();
  const [sectionName, setSectionName] = useState<string>("");
  const [showAddSectionComponent, setShowAddSectionComponent] =
    useState<boolean>(false);
  useEffect(() => {
    const fetchProjectFunc = async () => {
      const response = await fetchProject(params.projectId);
      if (!response) {
      } else {
        const { data, status } = response;
        await redirectToLogin(status, data?.error);
        setActiveProject(data);
        localStorage.setItem(params.projectId, JSON.stringify(data));
      }
    };
    const getProject = async () => {
      if (activeProject) return;
      const stringData = localStorage.getItem(params.projectId);
      const project: Project = stringData ? JSON.parse(stringData) : undefined;

      if (project?._id) {
        setActiveProject(project);
      } else {
        await fetchProjectFunc();
      }
    };
    const syncProject = async () => {
      if (activeProject?._id) {
        await fetchProjectFunc();
      }
    };
    const resolveFuncSync = async () => {
      await Promise.all([getProject(), syncProject()]);
    };
    resolveFuncSync();
  }, []);

  const addSection = async () => {
    if (sectionName === "") {
      // console.log("bad request");
      return;
    }
    if (!activeProject) return;
    try {
      const response = await fetch("/api/section/", {
        method: "POST",
        body: JSON.stringify({ sectionName, projectId: activeProject._id }),
      });
      const data = await response.json();
      await redirectToLogin(response.status, data.error);
      const newSection: Section = {
        sectionName: sectionName,
        tasks: [],
        projectId: activeProject?._id,
        _id: data._id,
      };

      const newProject: Project = {
        ...activeProject,
        sections: [...activeProject.sections, newSection],
      };
      setActiveProject(newProject);
    } catch (err) {
      // isError = true;
    }

    setShowAddSectionComponent(false);
  };
  if (!activeProject?.sections) return <>loading state</>;
  return (
    <div>
      <div>
        <ul className="flex w-full justify-between [&>li]:w-[20%] border border-border-default rounded-t-lg  [&>li]:py-2 text-sm ">
          <li className="pl-2">Task name</li>
          <li> Assignee</li>
          <li> Due date </li>
          <li> Priority </li>
          <li> Status </li>
        </ul>
        {activeProject.sections.map((section, index) => (
          <TableDropdown
            section={section}
            isLast={activeProject.sections.length - 1 === index}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
