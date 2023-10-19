"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import { usePopper } from "react-popper";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { ReactNode, useEffect, useState } from "react";
import Project from "@/interfaces/project";
import Section from "@/interfaces/section";
import { IoMdArrowDropdown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import RenderStatus, { RenderPriority } from "@/components/ConditionalRender";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import { FiLoader } from "react-icons/fi";
import { RiTimerLine } from "react-icons/ri";
import { BiCircle } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import {
  HiOutlineArrowSmDown,
  HiOutlineArrowSmRight,
  HiOutlineArrowSmUp,
} from "react-icons/hi";
import Task from "@/interfaces/task";

const TaskRowComponent = ({ task }: { task: Task }) => {
  const [showPriorityMenu, setShowPriorityMenu] = useState<boolean>(false);
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);

  interface StatusObj {
    [key: string]: {
      color: string;
      text: string;
      icon: ReactNode;
    };
  }
  const statusObj: StatusObj = {
    null: {
      color: "#aaa",
      text: "Not selected",
      icon: <BiCircle />,
    },
    toDo: { color: "#B0C4DE", text: "Todo", icon: <FiLoader /> },
    inProgress: {
      color: "#FFA500",
      text: "In Progress",
      icon: <RiTimerLine />,
    },
    done: { color: "#008000", text: "Done", icon: <FiCheck /> },
  };
  interface PriorityObj {
    [key: string]: {
      color: string;
      text: string;
      icon: ReactNode;
    };
  }
  const priorityObj: PriorityObj = {
    null: {
      color: "#aaa",
      text: "Not selected",
      icon: <BiCircle />,
    },
    low: { color: "#90EE90", text: "Low", icon: <HiOutlineArrowSmDown /> },
    medium: {
      color: "#FFA500",
      text: "Medium",
      icon: <HiOutlineArrowSmRight />,
    },
    high: { color: "#8B0000", text: "High", icon: <HiOutlineArrowSmUp /> },
  };
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const [referenceElement2, setReferenceElement2] =
    useState<HTMLDivElement | null>(null);
  const [popperElement2, setPopperElement2] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement2, setArrowElement2] = useState<HTMLDivElement | null>(
    null
  );
  const { styles: styles2, attributes: attributes2 } = usePopper(
    referenceElement2,
    popperElement2,
    {
      placement: "bottom",
      modifiers: [{ name: "arrow", options: { element: arrowElement2 } }],
    }
  );
  return (
    <ul
      className="w-full flex justify-between [&>li]:w-[20%] border-t
     border-border-default [&>li]:flex [&>li]:items-center h-12
    [&>li]:pr-2 text-sm"
      key={task._id}
      onClick={() => console.log(task)}
    >
      <li className="pl-8">{task.taskName}</li>
      <li className="flex items-center">
        <div className="w-5 h-5 rounded-full bg-slate-600 mr-2" />
        {"debo"}
      </li>
      <li>
        <div></div> sep - 17
      </li>
      <li className="">
        <div
          className="py-1 h-9 border px-2 text-sm w-full rounded-lg border-border-default relative
          flex items-center justify-between cursor-pointer hover:bg-menuItem-hover"
          ref={setReferenceElement}
          onClick={() => {
            setShowPriorityMenu(!showPriorityMenu);
          }}
        >
          <div className="flex items-center">
            <i className="mr-2">{priorityObj[task.Priority].icon}</i>
            {priorityObj[task.Priority].text}
          </div>
          <i className="text-muted-dark ml-2">
            <IoIosArrowDown />
          </i>
          {showPriorityMenu && (
            <div
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              className="bg-bg-secondary w-[calc(100%+1px)] z-50 border border-border-default rounded-lg"
            >
              {Object.values(priorityObj).map((priority) => (
                <div
                  className="py-1 h-9 px-2 text-sm  
                  flex items-center w-full"
                  key={priority.text}
                >
                  <div className="flex items-center  py-1 px-2 cursor-pointer hover:bg-menuItem-hover w-full rounded-lg">
                    <i className="mr-2">{priority.icon}</i>
                    {priority.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </li>
      <li className="[&>div]:px-2 [&>div]:text-sm ">
        <div
          className="py-1 border h-9 px-2 text-sm rounded-lg border-border-default w-full relative
        justify-between flex items-center cursor-pointer hover:bg-menuItem-hover"
          ref={setReferenceElement2}
          onClick={() => {
            setShowStatusMenu(!showStatusMenu);
          }}
        >
          <div className="flex items-center">
            <i className="mr-2">{statusObj[task.status].icon}</i>

            {statusObj[task.status].text}
          </div>
          <i className="text-muted-dark ml-2">
            <IoIosArrowDown />
          </i>
          {showStatusMenu && (
            <div
              ref={setPopperElement2}
              style={styles2.popper}
              {...attributes2.popper}
              className="bg-bg-secondary w-[calc(100%+3px)] z-50 border border-border-default rounded-lg"
            >
              {Object.values(statusObj).map((status, index) => (
                <div
                  className="py-1 px-2 text-sm
                  flex items-center w-full"
                  key={status.text + index}
                >
                  <div className=" flex items-center  py-1 px-2 cursor-pointer hover:bg-menuItem-hover w-full rounded-lg">
                    <i className="mr-2">{status.icon}</i>
                    {status.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </li>
    </ul>
  );
};
const TableDropdown = ({
  section,
  projectId,
}: {
  section: Section | string;
  projectId: String;
}) => {
  const [localSection, setLocalSection] = useState<Section | string>(section);
  const [showMainComponent, setShowMainComponent] = useState(false);
  const [showAddTaskComponent, setShowAddTaskComponent] = useState(false);
  const { activeProject } = useGlobalContext();

  if (typeof localSection === "string") return <>loading component</>;
  const [taskName, setTaskName] = useState<string>("");
  const addTask = async () => {
    setShowAddTaskComponent(false);
    if (!projectId || !taskName) return;

    const postBody = { taskName, projectId, sectionId: localSection._id };
    const response = await fetch("/api/task/", {
      method: "POST",
      body: JSON.stringify(postBody),
    });
    setTaskName("");

    const data = await response.json();

    await redirectToLogin(response.status, data?.error);
    if (response.ok) {
      if (typeof localSection === "string" || !activeProject) return;

      const newLocalSection: Section = {
        sectionName: localSection.sectionName,
        tasks: [...localSection.tasks, data],
        projectId: activeProject._id,
        _id: data._id,
      };
      setLocalSection(newLocalSection);
    } else {
      console.log("something went wrong");
    }
  };
  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".addTaskInput")) {
        addTask();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [taskName]);

  return (
    <div
      className={`border border-border-default `}
      key={typeof section === "string" ? section : section._id}
    >
      <header
        onClick={() => setShowMainComponent(!showMainComponent)}
        className="flex items-center cursor-pointer py-2 font-medium h-12"
      >
        <i
          className={` px-2 ${
            !showMainComponent && "rotate-[-90deg]"
          } transition-transform duration-300  `}
        >
          <IoMdArrowDropdown />
        </i>
        <h1 className="">{localSection.sectionName}</h1>
      </header>
      <AnimatePresence>
        {showMainComponent && (
          <motion.main>
            {localSection.tasks.map((task) => {
              if (typeof task === "string") {
                return <div key={task}>loading comp</div>;
              } else {
                return <TaskRowComponent task={task} />;
              }
            })}

            {showAddTaskComponent ? (
              <div
                className="addTaskInput w-full flex [&>li]:w-[20%] border-t
                   border-border-default [&>li]:flex [&>li]:items-center [&>li]:py-1
                  [&>li]:pr-2 text-sm h-12"
              >
                <input
                  type="text"
                  autoFocus
                  className="bg-transparent h-full w-full text-input focus:ring-0 pl-8 border-none"
                  placeholder="Write a task name"
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>
            ) : (
              <div
                className="w-full flex border-t
                   border-border-default [&>li]:py-1
                  [&>li]:pr-2 text-sm pl-8 h-12 items-center text-muted-dark hover:bg-menuItem-hover cursor-pointer  "
                onClick={() => setShowAddTaskComponent(true)}
              >
                <i className="mr-2">
                  <IoMdAdd />
                </i>
                Add Task
              </div>
            )}
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
    useState<boolean>(true);
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
  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".addSectionInput")) {
        await addSection();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [sectionName]);

  const addSection = async () => {
    setShowAddSectionComponent(true);
    if (sectionName === "") {
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
  };
  if (!activeProject?.sections) return <>loading state</>;
  return (
    <div className="">
      <div>
        <div className="pr-[10px] w-full">
          <ul
            className="flex gutter w-full justify-between [&>li]:w-[20%] border border-border-default rounded-t-lg 
         [&>li]:py-2 text-sm text-muted-dark"
          >
            <li className="pl-2">Task name</li>
            <li> Assignee</li>
            <li> Due date </li>
            <li> Priority </li>
            <li> Status </li>
          </ul>
        </div>
        <div className="h-[calc(100dvh-266px)] overflow-y-scroll scrollBar pb-1 ">
          {activeProject.sections.map((section, index) => (
            <TableDropdown
              section={section}
              projectId={params.projectId}
              // isLast={activeProject.sections.length - 1 === index}
            />
          ))}
          <div className="w-full border  border-border-default rounded-b-lg ">
            {showAddSectionComponent ? (
              <div
                className="py-2 h-12 pl-2 flex items-center hover:bg-menuItem-hover cursor-pointer text-muted-dark"
                onClick={() => setShowAddSectionComponent(false)}
              >
                <i className="mr-2">
                  <IoMdAdd />
                </i>
                Add section
              </div>
            ) : (
              <div className="addSectionInput w-full flex text-sm h-12">
                <input
                  type="text"
                  autoFocus
                  className="bg-transparent h-full w-full text-input focus:ring-0 pl-8 border-none"
                  placeholder="Write a task name"
                  onChange={(e) => setSectionName(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
