import Section from "@/interfaces/section";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState, MouseEvent } from "react";
import { IoMdAdd, IoMdArrowDropdown } from "react-icons/io";
import TaskRowComponent from "./TaskRowComponent";
import { fetchAndHelpRedirect } from "@/helpers/redirect";
import { TableColumn } from "@/interfaces/Table";
import EditableTextComponent from "@/components/others/EditableTextComponent";

const TableDropdown = ({
  section,
  projectId,
  isLast,
  tableColumsRenderArray,
}: {
  section: Section | string;
  projectId: string;
  isLast: boolean;
  tableColumsRenderArray: TableColumn[];
}) => {
  const localTableMainComponentShowObjectString = localStorage.getItem(
    "localTableMainComponentRenderObject",
  );
  const localTableMainComponentShowObject =
    localTableMainComponentShowObjectString
      ? JSON.parse(localTableMainComponentShowObjectString)
      : {};

  const [localSection, setLocalSection] = useState<Section | string>(section);
  const [showMainComponent, setShowMainComponent] = useState<boolean>(
    !!(typeof localSection === "object"
      ? localTableMainComponentShowObject?.[localSection?._id]
      : false),
  );
  const [showAddTaskComponent, setShowAddTaskComponent] = useState(false);

  if (typeof localSection === "string") return <>loading component</>;
  const [taskName, setTaskName] = useState<string>("");
  const addTask = async () => {
    setShowAddTaskComponent(false);
    if (!projectId || !taskName) return;

    const postBody = { taskName, projectId, sectionId: localSection._id };
    const { status, data, _response } = await fetchAndHelpRedirect(
      "/api/task/",
      {
        method: "POST",
        body: JSON.stringify(postBody),
      },
    );
    setTaskName("");

    if (_response.ok) {
      if (typeof localSection === "string") return;

      const newLocalSection: Section = {
        sectionName: localSection.sectionName,
        tasks: [...localSection.tasks, data],
        projectId: projectId,
        _id: data._id,
      };
      setLocalSection(newLocalSection);
    } else {
      console.log("something went wrong");
    }
  };
  useEffect(() => {
    const handleClick = async (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".addTaskInput")) {
        await addTask();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [taskName]);

  const hanldeToggleMainComponent = (e: MouseEvent) => {
    if (typeof localStorage !== "object") return;

    const clickTarget = e.target as HTMLElement;
    if (clickTarget.closest(".tableHeader")) return;

    const localTableMainComponentShowObjectString = localStorage.getItem(
      "localTableMainComponentRenderObject",
    );
    const localTableMainComponentShowObject =
      localTableMainComponentShowObjectString
        ? JSON.parse(localTableMainComponentShowObjectString)
        : {};

    const newLocalTableMainComponentShowObjectString = {
      ...localTableMainComponentShowObject,
      [localSection._id]: !showMainComponent,
    };
    localStorage.setItem(
      "localTableMainComponentRenderObject",
      JSON.stringify(newLocalTableMainComponentShowObjectString),
    );
    setShowMainComponent(!showMainComponent);
  };
  const hanldeTextSave = async (text: string) => {
    console.log(text);
  };

  return (
    <div
      key={typeof section === "string" ? section : section._id}
      className="select-none"
    >
      <header
        onClick={hanldeToggleMainComponent}
        className="stickyy z-40w-full top-0 cursor-pointer 
        bg-bg-secondary px-8"
      >
        <div
          className={`${
            !showMainComponent ? "border-b-0" : "border-b"
          } flex  h-12 items-center border-border-default font-medium`}
        >
          <i
            className={` px-2 ${
              !showMainComponent && "rotate-[-90deg]"
            } transition-transform duration-300  `}
          >
            <IoMdArrowDropdown />
          </i>
          <h1 className="tableHeader">
            <EditableTextComponent
              text={localSection.sectionName}
              handleTextSave={hanldeTextSave}
              styles="max-w-max"
              key={localSection.sectionName}
            />
          </h1>
        </div>
      </header>
      <AnimatePresence>
        {showMainComponent && (
          <motion.main>
            {localSection.tasks.map((task) => {
              if (typeof task === "string") {
                return <div key={task}>loading comp</div>;
              } else {
                return (
                  <TaskRowComponent
                    task={task}
                    tableColumsRenderArray={tableColumsRenderArray}
                    key={task._id}
                  />
                );
              }
            })}

            {showAddTaskComponent ? (
              <div
                className={`${
                  !isLast && "border-b"
                } addTaskInput flex h-12 w-full border-t
                     border-border-default text-sm `}
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
                className={` flex h-12 w-full cursor-pointer items-center
                     border-border-default pl-8 text-sm text-muted-dark hover:bg-menuItem-hover`}
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

export default TableDropdown;
