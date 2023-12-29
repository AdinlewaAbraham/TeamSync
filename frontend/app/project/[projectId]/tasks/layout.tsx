"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaRegCalendar, FaChartLine, FaRegListAlt } from "react-icons/fa";
import {} from "react-icons/";
import { PiFlowArrowBold } from "react-icons/pi";
import {} from "react-icons/";
import { useGlobalContext } from "@/context/GeneralContext";
import socket from "@/config/WebSocketManager";
import Section from "@/interfaces/section";
import Project from "@/interfaces/project";
import project from "@/interfaces/project";
import Task from "@/interfaces/task";

const NavbarItem = ({
  title,
  projectId,
  icon,
}: {
  title: string;
  projectId: string;
  icon: ReactNode;
}) => {
  const pathname = usePathname();
  const lowercaseTitle = title.toLowerCase();
  const isCurrentTab = pathname.endsWith(lowercaseTitle);
  return (
    <Link
      href={"/project/" + projectId + "/tasks/" + lowercaseTitle}
      key={title}
    >
      <li
        className={`flex max-w-max cursor-pointer items-center rounded-lg px-3 py-1 text-sm text-muted-dark
         transition-colors duration-150 hover:text-white 
        ${isCurrentTab && "bg-bg-secondary text-white"}`}
      >
        <i
          className={`mr-1 ${title.toLowerCase() === "board" && "rotate-180"} `}
        >
          {icon}
        </i>
        {title}
      </li>
    </Link>
  );
};

const layout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: { projectId: string };
}) => {
  const { activeProject, setActiveProject } = useGlobalContext();
  useEffect(() => {
    if (activeProject) {
      // join websocket project room
      socket.emit("join_room", `project_${params.projectId}`);

      // project controllers
      const handleProjectAdded = (project: Project) => {};
      const handleProjectDeleted = (projectId: string) => {
        if (projectId === activeProject._id) {
        }
      };

      // section controllers
      const handleSectionAdded = (section: Section) => {
        const newProject = {
          ...activeProject,
          sections: [...activeProject.sections, section],
        };
        setActiveProject(newProject);
      };
      const handleSectionUpdated = (section: Section) => {
        const newSections: (Section | string)[] = activeProject.sections.map(
          (_section) => {
            if (typeof _section !== "object" || _section._id !== section._id) {
              return _section;
            }
            return section;
          },
        );
        const newProject: Project = { ...activeProject, sections: newSections };
        setActiveProject(newProject);
      };
      const handleSectionDeleted = (sectionId: string) => {
        const filteredSections = activeProject.sections.filter(
          (section) => typeof section === "object" && section._id !== sectionId,
        );
        const newProject = {
          ...activeProject,
          sections: filteredSections,
        };
        setActiveProject(newProject);
      };

      // task controllers
      const handleTaskAdded = (task: Task) => {
        console.log("this is my function");
        const deepProjectCopy: Project = JSON.parse(
          JSON.stringify(activeProject),
        );
        const NewSections = deepProjectCopy.sections.map((section) => {
          if (typeof section === "string" || section._id !== task.sectionId) {
            return section;
          }
          return { ...section, tasks: [...section.tasks, task] };
        }) as Section[];
        // localStorage.removeItem("localTaskPositionObject");
        setActiveProject({ ...deepProjectCopy, sections: NewSections });
      };
      const handleTaskUpdated = (task: Task) => {
        const updatedSections = activeProject.sections.map((section) => {
          if (typeof section === "string" || section._id !== task.sectionId) {
            return section as Section;
          }

          const updatedTasks = section.tasks.map((_task) =>
            typeof _task !== "object" || _task._id !== task._id ? _task : task,
          );

          return { ...section, tasks: updatedTasks } as Section;
        });

        setActiveProject({ ...activeProject, sections: updatedSections} );
      };
      const handleTaskDeleted = (taskId: string, sectionId: string) => {
        const deepProjectCopy: Project = JSON.parse(
          JSON.stringify(activeProject),
        );
        const newSections: (Section | string)[] = deepProjectCopy.sections.map(
          (section) => {
            if (typeof section !== "object" || section._id !== sectionId) {
              return section;
            }
            const newTasks = [...section.tasks].filter(
              (task) => typeof task !== "string" && task._id !== taskId,
            ) as Task[];

            const newSection: Section = { ...section, tasks: newTasks };
            return newSection;
          },
        );
        const newProject: Project = {
          ...deepProjectCopy,
          sections: newSections,
        };
        // localStorage.removeItem("localTaskPositionObject");
        setActiveProject(newProject);
      };

      // add project event
      socket.on("project_updated", handleProjectAdded);
      socket.on("project_deleted", handleProjectDeleted);

      // add section event
      socket.on("section_added", handleSectionAdded);
      socket.on("section_updated", handleSectionUpdated);
      socket.on("section_deleted", handleSectionDeleted);

      // add task event
      socket.on("task_added", handleTaskAdded);
      socket.on("task_updated", handleTaskUpdated);
      socket.on("task_deleted", handleTaskDeleted);

      return () => {
        // remove project event
        socket.off("project_updated", handleProjectAdded);
        socket.off("project_deleted", handleProjectDeleted);

        // remove section event
        socket.off("section_added", handleSectionAdded);
        socket.off("section_updated", handleSectionUpdated);
        socket.off("section_deleted", handleSectionDeleted);

        // remove task event
        socket.off("task_added", handleTaskAdded);
        socket.off("task_updated", handleTaskUpdated);
        socket.off("task_deleted", handleTaskDeleted);
      };
    }
  }, [activeProject]);

  return (
    <div className="flex h-full flex-1 flex-col ">
      <nav className="ml-8 py-4 ">
        <ul className="flex h-9 max-w-max items-center justify-center rounded-lg bg-bg-primary p-1">
          {[
            { title: "Board", icon: <BiSolidBarChartAlt2 /> },
            { title: "Table", icon: <FaRegListAlt /> },
            { title: "Calendar", icon: <FaRegCalendar /> },
            { title: "Timeline", icon: <FaChartLine /> },
          ].map((listItem) => (
            <NavbarItem
              title={listItem.title}
              projectId={params.projectId}
              icon={listItem.icon}
              key={listItem.title}
            />
          ))}
        </ul>
      </nav>
      <main className="relative flex-1 overflow-auto">
        <div className="absolute inset-0 flex"> {children}</div>
      </main>
    </div>
  );
};

export default layout;
