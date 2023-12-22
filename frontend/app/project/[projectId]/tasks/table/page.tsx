"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import { usePopper } from "react-popper";
import fetchProject from "@/helpers/project/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { ReactNode, useEffect, useState } from "react";
import Project from "@/interfaces/project";
import Section from "@/interfaces/section";
import { IoMdArrowDropdown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import RenderStatus, {
  RenderPriority,
} from "@/components/tasks/ConditionalRender";
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
import Table from "@/components/tasks/table/Table";

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
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const [referenceElement2, setReferenceElement2] =
    useState<HTMLDivElement | null>(null);
  const [popperElement2, setPopperElement2] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement2, setArrowElement2] = useState<HTMLDivElement | null>(
    null,
  );
  const { styles: styles2, attributes: attributes2 } = usePopper(
    referenceElement2,
    popperElement2,
    {
      placement: "bottom",
      modifiers: [{ name: "arrow", options: { element: arrowElement2 } }],
    },
  );
  return (
    <ul
      className="flex h-12 w-full justify-between border-t
     border-border-default text-sm [&>li]:flex [&>li]:w-[20%]
    [&>li]:items-center [&>li]:pr-2"
      key={task._id}
      onClick={() => console.log(task)}
    >
      <li className="pl-8">{task.taskName}</li>
      <li className="flex items-center">
        <div className="mr-2 h-5 w-5 rounded-full bg-slate-600" />
        {"debo"}
      </li>
      <li>
        <div></div> sep - 17
      </li>
      <li className="">
        <div
          className="relative flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border
          border-border-default px-2 py-1 text-sm hover:bg-menuItem-hover"
          ref={setReferenceElement}
          onClick={() => {
            setShowPriorityMenu(!showPriorityMenu);
          }}
        >
          <div className="flex items-center">
            <i className="mr-2">{priorityObj[task.Priority].icon}</i>
            {priorityObj[task.Priority].text}
          </div>
          <i className="ml-2 text-muted-dark">
            <IoIosArrowDown />
          </i>
          {showPriorityMenu && (
            <div
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              className="z-50 w-[calc(100%+1px)] rounded-lg border border-border-default bg-bg-secondary"
            >
              {Object.values(priorityObj).map((priority) => (
                <div
                  className="flex h-9 w-full items-center  
                  px-2 py-1 text-sm"
                  key={priority.text}
                >
                  <div className="flex w-full  cursor-pointer items-center rounded-lg px-2 py-1 hover:bg-menuItem-hover">
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
          className="relative flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border
        border-border-default px-2 py-1 text-sm hover:bg-menuItem-hover"
          ref={setReferenceElement2}
          onClick={() => {
            setShowStatusMenu(!showStatusMenu);
          }}
        >
          <div className="flex items-center">
            <i className="mr-2">{statusObj[task.status].icon}</i>

            {statusObj[task.status].text}
          </div>
          <i className="ml-2 text-muted-dark">
            <IoIosArrowDown />
          </i>
          {showStatusMenu && (
            <div
              ref={setPopperElement2}
              style={styles2.popper}
              {...attributes2.popper}
              className="z-50 w-[calc(100%+3px)] rounded-lg border border-border-default bg-bg-secondary"
            >
              {Object.values(statusObj).map((status, index) => (
                <div
                  className="flex w-full items-center
                  px-2 py-1 text-sm"
                  key={status.text + index}
                >
                  <div className=" flex w-full  cursor-pointer items-center rounded-lg px-2 py-1 hover:bg-menuItem-hover">
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
        className="flex h-12 cursor-pointer items-center py-2 font-medium"
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
                className="addTaskInput flex h-12 w-full border-t
                   border-border-default text-sm [&>li]:flex [&>li]:w-[20%]
                  [&>li]:items-center [&>li]:py-1 [&>li]:pr-2"
              >
                <input
                  type="text"
                  autoFocus
                  className="text-input h-full w-full border-none bg-transparent pl-8 focus:ring-0"
                  placeholder="Write a task name"
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>
            ) : (
              <div
                className="flex h-12 w-full
                   cursor-pointer items-center
                  border-t border-border-default pl-8 text-sm text-muted-dark hover:bg-menuItem-hover [&>li]:py-1 [&>li]:pr-2  "
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

  if (!activeProject?.sections)
    return (
      <div className="flex flex-1 items-center justify-center">
        loading state
      </div>
    );
  return (
    <Table
      paramsProjectId={params.projectId}
      project={activeProject}
      setProject={setActiveProject}
    />
  );
};

export default page;
