import List from "@/interfaces/section";
import React, { useEffect, useRef, useState } from "react";
import SidebarIconComponent from "../../sidebar/SidebarIconComponent";
import { IoMdAdd } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { fetchWithAuth } from "@/app/api/fetchWithAuth";
import { redirectToLogin } from "@/helpers/redirect";
import Section from "@/interfaces/section";
import { useGlobalContext } from "@/context/GeneralContext";
import RenderStatus, { RenderPriority } from "../ConditionalRender";
import { usePopper } from "react-popper";
import deleteSection from "@/helpers/section/deleteSection";
import findMinFreeRowNumber from "@/utilis/findMinFreeRowNumber";
import BoardTaskCard from "./BoardTaskCard";
import socket from "@/config/WebSocketManager";
import Task from "@/interfaces/task";

const BoardCard = ({
  section,
  projectId,
}: {
  section: Section;
  projectId: string;
}) => {
  const [showAddTaskComponent, setShowAddTaskComponent] =
    useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [showBoardMenu, setShowBoardMenu] = useState<boolean>(false);

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { taskComponentHeight } = useGlobalContext();

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });
  // console.log(section.tasks);
  const handleAddTask = async () => {
    setShowAddTaskComponent(false);
    if (!projectId || !taskName || typeof section === "string") return;
    const startDate = new Date();

    const lastDate = new Date(startDate);
    lastDate.setDate(startDate.getDate() + 10);
    startDate.setDate(startDate.getDate());

    const rowNumber = findMinFreeRowNumber(
      section.tasks,
      startDate,
      lastDate,
      0,
    );

    console.log("this is rownumber " + rowNumber, section.tasks);

    const postBody = {
      taskName,
      projectId,
      sectionId: section._id,
      dateToStart: startDate,
      dueDate: lastDate,
      rowNumber: rowNumber,
    };
    const response = await fetch("/api/task/", {
      method: "POST",
      body: JSON.stringify(postBody),
    });

    const data = await response.json();

    await redirectToLogin(response.status, data?.error);
    if (response.ok) {
    } else {
      console.log("something went wrong");
    }
    setTaskName("");
  };
  const deleteSectionFunc = async () => {
    if (typeof section === "string") return;
    const returnObj = await deleteSection(section._id, projectId);
    if (!returnObj) return;
    const { data, status } = returnObj;
    console.log(data, status);
    // if (status === 200) {
    //   console.log("yahhhhhhhhhhhh");
    //   if (!activeProject) return;
    //   const filteredSections = activeProject.sections.filter((arrSection) => {
    //     if (typeof arrSection === "string") return;
    //     return arrSection._id !== section._id;
    //   });
    //   const newActiveProject = {
    //     ...activeProject,
    //     sections: filteredSections,
    //   };
    //   // setActiveProject(newActiveProject);
    // }
  };

  useEffect(() => {
    if (typeof section === "object") {
      const sectionId = section._id;
      // const handleAddTask = (task: Task) => {
      //   if (sectionId !== task.sectionId) return;
      //   console.log("setting sections now!");
      //   setLocalSection((prevLocalSection) => {
      //     if (prevLocalSection._id === task.sectionId) {
      //       return {
      //         ...prevLocalSection,
      //         tasks: [...prevLocalSection.tasks, task] as Task[],
      //       };
      //     }
      //     return prevLocalSection;
      //   });
      // };
      const handleDeleteTask = (taskId: string) => {
        const sectionCopy = { ...section };
        sectionCopy.tasks = [...sectionCopy.tasks].filter(
          (task) => typeof task === "object" && task._id !== taskId,
        ) as Task[];
        // setLocalSection(sectionCopy);
      };
      socket.emit("join_room", `section_${section._id}`);
      // socket.on("task_added", handleAddTask);
      socket.on("task_deleted", handleDeleteTask);

      return () => {
        // socket.off("task_added", handleAddTask);
        socket.off("task_deleted", handleDeleteTask);
      };
    }
  }, [section, section]);

  if (typeof section === "string") return <>loading this is a string </>;
  return (
    <div onClick={() => console.log(section._id)}>
      <div className="mr-2 flex max-h-full w-[280px] flex-1 flex-col overflow-auto rounded-lg bg-bg-primary py-2">
        <header className="flex items-center justify-between px-4 py-2">
          <h1>{section.sectionName}</h1>
          <div className="addTaskComponent flex items-start">
            <div
              onClick={() => {
                setShowAddTaskComponent(!showAddTaskComponent);
              }}
              className="cursor-pointer"
            >
              <SidebarIconComponent
                icon={<IoMdAdd />}
                toolTipText={"Add project"}
              />
            </div>
            <div
              onClick={() => setShowBoardMenu(!showBoardMenu)}
              className="cursor-pointer"
              ref={setReferenceElement}
            >
              <SidebarIconComponent
                icon={<BsThreeDots />}
                toolTipText="Show options"
              />
            </div>
            {showBoardMenu && (
              <div
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
                className="[&>div]:  [&>div]: rounded-lg border border-border-default bg-bg-primary  
              [&>div]:cursor-pointer [&>div]:px-4 [&>div]:py-2 hover:[&>div]:bg-menuItem-hover "
              >
                <div>rename section</div>
                <div onClick={() => deleteSectionFunc()} className="">
                  {" "}
                  delete section
                </div>
              </div>
            )}
          </div>
        </header>
        <div className={`scrollBar max-h-full flex-1 overflow-y-auto `}>
          <ul>
            {section.tasks.map((task, index) => (
              <li key={index}>
                {typeof task === "string" ? (
                  <>loading</>
                ) : (
                  <BoardTaskCard task={task} key={task._id} />
                )}
              </li>
            ))}
          </ul>
        </div>
        <footer className="addTaskComponent px-2">
          {showAddTaskComponent ? (
            <div className="py-2 text-base">
              <textarea
                cols={30}
                rows={10}
                autoFocus
                className="text-input h-[90px] w-full resize-none bg-bg-secondary p-2 focus:ring-0"
                placeholder="provide task name"
                onChange={(e) => setTaskName(e.target.value)}
                value={taskName}
                onBlur={async () => await handleAddTask()}
              />
              <div className="flex items-center">
                <button
                  className="button-default accent-color mr-2"
                  onClick={() => {
                    handleAddTask();
                  }}
                >
                  add task
                </button>
                <i
                  className="cursor-pointer p-1 text-2xl text-icon-default transition-colors duration-150 hover:text-white"
                  onClick={() => setShowAddTaskComponent(false)}
                >
                  <MdClose />
                </i>
              </div>
            </div>
          ) : (
            <div
              className="mt-2 flex cursor-pointer items-center rounded-lg px-2 py-2 hover:bg-menuItem-hover"
              onClick={() => setShowAddTaskComponent(true)}
            >
              <i className="mr-2">
                <IoMdAdd />
              </i>
              add a task
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default BoardCard;
