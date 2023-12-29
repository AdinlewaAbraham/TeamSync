import Project from "@/interfaces/project";
import React, { useEffect, useState } from "react";
import BoardCard from "./BoardCard";
import { MdClose } from "react-icons/md";
import Section from "@/interfaces/section";
import { IoMdAdd } from "react-icons/io";
import { useGlobalContext } from "@/context/GeneralContext";
import Task from "@/interfaces/task";
import socket from "@/config/WebSocketManager";

const Board = ({ paramsProjectId }: { paramsProjectId: string }) => {
  const [sectionName, setSectionName] = useState<string>("");
  const [showAddSectionComponent, setShowAddSectionComponent] =
    useState<boolean>(false);
  const [addingSection, setAddingSection] = useState(false);

  const { activeProject } = useGlobalContext();
  if (!activeProject) return <>loading...</>;
  const addSection = async () => {
    setAddingSection(true);
    if (sectionName === "" || addingSection) {
      return;
    }
    console.log("add section");
    if (!activeProject) return;
    try {
      const response = await fetch("/api/section/", {
        method: "POST",
        body: JSON.stringify({ sectionName, projectId: activeProject._id }),
      });
      const data = await response.json();
      // await redirectToLogin(response.status, data.error);
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
      // setActiveProject(newProject);
    } catch (err) {
      // isError = true;
    }

    setAddingSection(false);
    setShowAddSectionComponent(false);
  };
  return (
    <div
      className="overflow-x relative flex flex-1 overflow-auto  px-8 "
      id="overflowElement"
    >
      {activeProject.sections.map((section, index) => {
        if (typeof section === "string") return <>loading</>;
        return (
          <BoardCard
            section={section}
            projectId={paramsProjectId}
            key={typeof section === "string" ? section : section._id}
          />
        );
      })}
      <div>
        {showAddSectionComponent ? (
          <div className="addSectionComponent flex w-[280px] flex-col rounded-lg bg-bg-primary px-2 py-2 pt-0">
            <div className="flex h-[60px] items-center">
              <input
                type="text"
                autoFocus
                className="text-input w-full"
                onChange={(e) => setSectionName(e.target.value)}
                onBlur={async () => await addSection()}
              />
            </div>

            <div className="mb-1 flex items-center overflow-hidden">
              <button
                className="button-default accent-color mr-2"
                onClick={() => {
                  addSection();
                }}
              >
                Add section
              </button>
              <i
                className="cursor-pointer p-1 text-2xl text-icon-default transition-colors duration-150 hover:text-white"
                onClick={() => setShowAddSectionComponent(false)}
              >
                <MdClose />
              </i>
            </div>
          </div>
        ) : (
          <div
            className="addSectionComponent flex h-[60px]  w-[280px] cursor-pointer items-center rounded-lg bg-bg-primary px-4 py-2 hover:bg-menuItem-hover"
            onClick={() => setShowAddSectionComponent(true)}
          >
            <i className="mr-2">
              <IoMdAdd />
            </i>
            Add section
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
