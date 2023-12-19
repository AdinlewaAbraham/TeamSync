import List from "@/interfaces/section";
import React, { useEffect, useRef, useState } from "react";
import SidebarIconComponent from "../../../sidebar/SidebarIconComponent";
import { IoMdAdd } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { fetchWithAuth } from "@/app/api/fetchWithAuth";
import { redirectToLogin } from "@/helpers/redirect";
import Section from "@/interfaces/section";
import { useGlobalContext } from "@/context/GeneralContext";
import RenderStatus, { RenderPriority } from "../ConditionalRender";
import { usePopper } from "react-popper";
import deleteSection from "@/helpers/deleteSection";
import findMinFreeRowNumber from "@/utilis/findMinFreeRowNumber";

const BoardCard = ({
  section,
  projectId,
}: {
  section: Section | string;
  projectId: string;
}) => {
  const [showAddTaskComponent, setShowAddTaskComponent] =
    useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const { setActiveProject, activeProject } = useGlobalContext();
  const [showBoardMenu, setShowBoardMenu] = useState<boolean>(false);
  const [localSection, setLocalSection] = useState<Section | string>(section);

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
    setTaskName("");
  };
  const deleteSectionFunc = async () => {
    if (typeof section === "string") return;
    const returnObj = await deleteSection(section._id, projectId);
    if (!returnObj) return;
    const { data, status } = returnObj;
    console.log(data, status);
    if (status === 200) {
      console.log("yahhhhhhhhhhhh");
      if (!activeProject) return;
      const filteredSections = activeProject.sections.filter((arrSection) => {
        if (typeof arrSection === "string") return;
        return arrSection._id !== section._id;
      });
      const newActiveProject = {
        ...activeProject,
        sections: filteredSections,
      };
      setActiveProject(newActiveProject);
    }
  };
  // useEffect(() => {
  //   const handleClick = (e: MouseEvent) => {
  //     const target = e.target as HTMLElement;
  //     if (!target.closest(".addTaskComponent")) {
  //       handleAddTask();
  //     }
  //   };
  //   window.addEventListener("click", handleClick);
  //   return () => window.removeEventListener("click", handleClick);
  // }, []);

  if (typeof localSection === "string") return <>loading this is a string </>;
  return (
    <div>
      <div className="mr-2 flex max-h-full w-[280px] flex-1 flex-col overflow-auto rounded-lg bg-bg-primary py-2">
        <header className="flex items-center justify-between px-4 py-2">
          <h1>{localSection.sectionName}</h1>
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
            {localSection.tasks.map((task, index) => (
              <li key={index}>
                {typeof task === "string" ? (
                  <>loading</>
                ) : (
                  <div
                    className="mb-2 px-2 "
                    onClick={() => console.log(taskComponentHeight)}
                  >
                    <div
                      className=" flex cursor-pointer  flex-col rounded-lg border
                     border-border-default px-2 py-4 hover:bg-menuItem-hover"
                    >
                      <p className="mb-4 leading-none"> {task.taskName}</p>
                      <div className="flex items-center ">
                        <div className=" [&>div]: [&>div]: flex items-center text-black [&>div]:rounded-xl [&>div]:text-sm">
                          <div className="mr-1 [&>div]:mb-4 [&>div]:rounded-xl [&>div]:px-2 [&>div]:text-xs">
                            <RenderPriority Priority={task.Priority} />
                          </div>

                          <div className="[&>div]:mb-4 [&>div]:rounded-xl [&>div]:px-2 [&>div]:text-xs">
                            <RenderStatus status={task.status} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 h-5 w-5 rounded-full bg-slate-600" />
                        <div className="text-xs text-muted-light">
                          today - sep 19
                        </div>
                      </div>
                    </div>
                  </div>
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
