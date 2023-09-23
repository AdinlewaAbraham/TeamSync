import List from "@/interfaces/section";
import React, { useEffect, useState } from "react";
import SidebarIconComponent from "../sidebar/SidebarIconComponent";
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

const BoardCard = ({
  section,
  projectId,
  isHorizontalOverflow,
}: {
  section: Section | string;
  projectId: string;
  isHorizontalOverflow: boolean;
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
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });
  const handleAddTask = async () => {
    setShowAddTaskComponent(false);
    if (!projectId || !taskName || typeof section === "string") return;
    const postBody = { taskName, projectId, sectionId: section._id };
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
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".addTaskComponent")) {
        handleAddTask();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  if (typeof localSection === "string") return <>loading this is a string </>;
  return (
    <div className="bg-bg-primary rounded-lg w-[280px] py-2 mr-2 ">
      <header className="flex justify-between items-center px-4 py-2">
        <h1>{localSection.sectionName}</h1>
        <div className="flex items-start addTaskComponent">
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
              className="[&>div]:px-4  [&>div]:py-2 hover:[&>div]:bg-menuItem-hover [&>div]:cursor-pointer [&>div]: [&>div]:  
              bg-bg-primary border border-border-default rounded-lg "
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
      <div
        className={` ${
          isHorizontalOverflow
            ? "max-h-[calc(100dvh-350px)]"
            : "max-h-[calc(100dvh-295px)]"
        }  overflow-auto scrollBar`}
      >
        <main>
          <ul>
            {localSection.tasks.map((task) => (
              <li>
                {typeof task === "string" ? (
                  <>loading</>
                ) : (
                  <div className="px-2 mb-2 ">
                    <div
                      className=" px-2 py-4  rounded-lg hover:bg-menuItem-hover cursor-pointer
                     flex flex-col border border-border-default"
                    >
                      <p className="mb-4 leading-none"> {task.taskName}</p>
                      <div className="flex items-center ">
                        <div className=" [&>div]:rounded-xl [&>div]:text-sm [&>div]: text-black [&>div]: flex items-center">
                          <div className="mr-1 [&>div]:px-2 [&>div]:rounded-xl [&>div]:text-xs [&>div]:mb-4">
                            <RenderPriority Priority={task.Priority} />
                          </div>

                          <div className="[&>div]:px-2 [&>div]:rounded-xl [&>div]:text-xs [&>div]:mb-4">
                            <RenderStatus status={task.status} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-slate-600 rounded-full mr-2" />
                        <div className="text-muted-light text-xs">
                          today - sep 19
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {/* {localSection.tasks.map((task) =><>{task}</>)} */}
        </main>
        <footer className=" px-2 addTaskComponent">
          {showAddTaskComponent ? (
            <div className="text-base py-2">
              <textarea
                cols={30}
                rows={10}
                autoFocus
                className="text-input focus:ring-0 bg-bg-secondary w-full p-2 h-[90px] resize-none"
                placeholder="provide task name"
                onChange={(e) => setTaskName(e.target.value)}
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
                  className="text-icon-default hover:text-white transition-colors duration-150 text-2xl p-1 cursor-pointer"
                  onClick={() => setShowAddTaskComponent(false)}
                >
                  <MdClose />
                </i>
              </div>
            </div>
          ) : (
            <div
              className="flex py-2 px-2 items-center mt-2 hover:bg-menuItem-hover rounded-lg cursor-pointer"
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
