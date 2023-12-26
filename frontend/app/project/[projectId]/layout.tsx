"use client";
import EditableComp from "@/components/others/EditableComp";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/project/fetchProject";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { LuClipboardCheck } from "react-icons/lu";
import { PiFlowArrowBold } from "react-icons/pi";
import { BiHomeAlt2 } from "react-icons/bi";
import {} from "react-icons/";
import {} from "react-icons/";
import {} from "react-icons/";
import {} from "react-icons/";
import { AnimatePresence, motion } from "framer-motion";
import SubLayoutReusableNavbar from "@/components/navbar/SubLayoutReusableNavbar/SubLayoutReusableNavbar";
import Section from "@/interfaces/section";
import Task from "@/interfaces/task";

const layout = ({
  params,
  children,
}: {
  params: { projectId: string };
  children: ReactNode;
}) => {
  const { user, activeWorkspace, activeProject, setActiveProject } =
    useGlobalContext();
  const [showNavbar, setShowNavbar] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const getProject = async () => {
      const response = await fetchProject(params.projectId);
      if (!response) {
        console.log("something went wrong ");
        return;
      }
      const { data, status } = response;
      if (status === 404 && data.error === "PROJECT_NOT_FOUND") {
        console.log("redirecting");
        router.push("/home"); // or push to disired url
      } else {
        // router.push("/project/" + params.projectId + "/home");
      }
    };
    getProject();
  }, []);
  const navbarBaseUrl = "/project/" + activeProject?._id + "/";
  const addTask = () => {
    if (!activeProject) return;
    const sectionId = "6588c9c02bef41cc9191b865";
    const project = { ...activeProject };
    const projectSections = [...activeProject.sections];
    const sectionToBeEditedIndex = projectSections.findIndex((section) => {
      if (typeof section !== "object") return false;
      return section._id === sectionId;
    });
    const sectionToBeEdited = projectSections.find((section) => {
      if (typeof section !== "object") return false;
      return section._id === sectionId;
    });
    const taskToBeAdded: Task = {
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
    };
    if (typeof sectionToBeEdited === "object") {
      const newSectionTasks: Task[] = [
        ...sectionToBeEdited.tasks,
        taskToBeAdded,
      ].filter((task) => typeof task !== "string") as Task[];

      sectionToBeEdited.tasks = newSectionTasks;
      projectSections.splice(sectionToBeEditedIndex, 1, sectionToBeEdited);
      project.sections = projectSections;
      setActiveProject({ ...project });
    }
  };

  const deleteTask = () => {};
  return (
    <section className="relative flex flex-1 flex-col overflow-x-hidden">
      <SubLayoutReusableNavbar
        isLoading={!activeProject}
        navHeader={activeProject?.projectName || ""}
        navbarItemsArray={[
          {
            href: navbarBaseUrl + "home",
            title: "home",
            icon: <BiHomeAlt2 />,
          },
          {
            href: navbarBaseUrl + "dashboard",
            title: "dashboard",
            icon: <FaChartLine />,
          },
          {
            href: navbarBaseUrl + "tasks",
            title: "tasks",
            icon: <LuClipboardCheck />,
          },
          {
            href: navbarBaseUrl + "files",
            title: "files",
            icon: <FaChartLine />,
          },
        ]}
        showNavbar={showNavbar}
      />

      <button
        onClick={() => setShowNavbar(!showNavbar)}
        className="absolute right-5 top-5 z-50"
      >
        toggle nav
      </button>
      <div className="flex justify-center">
        <button onClick={addTask} className="bg-green-400 px-2">
          add task
        </button>
        <button onClick={deleteTask} className="bg-red-400 px-2">
          delete task
        </button>
      </div>
      <main className="relative flex h-full flex-1 flex-col">{children}</main>
    </section>
  );
};

export default layout;
