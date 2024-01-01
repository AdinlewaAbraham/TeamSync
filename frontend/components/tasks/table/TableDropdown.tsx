import { redirectToLogin } from "@/helpers/redirect";
import Section from "@/interfaces/section";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { IoMdAdd, IoMdArrowDropdown } from "react-icons/io";
import TaskRowComponent from "./TaskRowComponent";

const TableDropdown = ({
  section,
  projectId,
}: {
  section: Section | string;
  projectId: string;
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
    const response = await fetch("/api/task/", {
      method: "POST",
      body: JSON.stringify(postBody),
    });
    setTaskName("");

    const data = await response.json();

    await redirectToLogin(response.status, data?.error);
    if (response.ok) {
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

export default TableDropdown;
