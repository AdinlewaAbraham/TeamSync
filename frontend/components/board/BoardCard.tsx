import List from "@/interfaces/section";
import React, { useEffect, useState } from "react";
import SidebarIconComponent from "../sidebar/SidebarIconComponent";
import { IoMdAdd } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { fetchWithAuth } from "@/app/api/fetchWithAuth";
import { redirectToLogin } from "@/helpers/redirect";

const BoardCard = ({
  section,
  projectId,
}: {
  section: List | string;
  projectId: string;
}) => {
  const [showAddTaskComponent, setShowAddTaskComponent] =
    useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");

  const handleAddTask = async () => {
    setShowAddTaskComponent(false);
    if (!projectId || !taskName) return;
    const postBody = { taskName, projectId };
    const response = await fetch("/api/task/", {
      method: "POST",
      body: JSON.stringify(postBody),
    });

    const data = await response.json();
    await redirectToLogin(response.status, data?.error);
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

  if (typeof section === "string") return <>loading this is a string </>;
  return (
    <div className="bg-bg-primary rounded-lg w-[280px] py-2 mr-2">
      <header className="flex justify-between items-center px-4 py-2">
        <h1>{section.listName}</h1>
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
          <div onClick={() => {}} className="cursor-pointer">
            <SidebarIconComponent
              icon={<BsThreeDots />}
              toolTipText="Show options"
            />
          </div>
        </div>
      </header>
      {/* <section className="p-2"></section> */}
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
      {/* <div className="border-[0.5px] border-red-400 left-0 right-0 fixed top-[290px] z-50"></div> */}
    </div>
  );
};

export default BoardCard;
