import Section from "@/interfaces/section";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { IoMdAdd, IoMdArrowDropdown } from "react-icons/io";
import TaskRowComponent from "./TaskRowComponent";
import { fetchAndHelpRedirect } from "@/helpers/redirect";

const TableDropdown = ({
  section,
  projectId,
  isLast,
}: {
  section: Section | string;
  projectId: string;
  isLast: boolean;
}) => {
  const [localSection, setLocalSection] = useState<Section | string>(section);
  const [showMainComponent, setShowMainComponent] = useState(false);
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
      className={`border-x border-border-default `}
      key={typeof section === "string" ? section : section._id}
    >
      <header
        onClick={() => setShowMainComponent(!showMainComponent)}
        className={` ${
          isLast && !showMainComponent ? "border-b-0" : "border-b"
        } sticky top-0 z-40 flex h-12 w-full cursor-pointer 
        items-center border-border-default bg-bg-secondary py-2 font-medium`}
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
                className={`${
                  !isLast && "border-b"
                } flex h-12 w-full cursor-pointer items-center border-t
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
