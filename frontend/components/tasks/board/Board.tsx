import Project from "@/interfaces/project";
import React, { useState } from "react";
import BoardCard from "./BoardCard";
import { MdClose } from "react-icons/md";
import Section from "@/interfaces/section";
import { IoMdAdd } from "react-icons/io";

const Board = ({
  project,
  setProject,
  paramsProjectId,
}: {
  project: Project;
  setProject: (c: Project) => void;
  paramsProjectId: string;
}) => {
  const [sectionName, setSectionName] = useState<string>("");
  const [showAddSectionComponent, setShowAddSectionComponent] =
    useState<boolean>(false);
  const [addingSection, setAddingSection] = useState(false);
  const addSection = async () => {
    setAddingSection(true);
    if (sectionName === "" || addingSection) {
      return;
    }
    console.log("add section");
    if (!project) return;
    try {
      const response = await fetch("/api/section/", {
        method: "POST",
        body: JSON.stringify({ sectionName, projectId: project._id }),
      });
      const data = await response.json();
      // await redirectToLogin(response.status, data.error);
      const newSection: Section = {
        sectionName: sectionName,
        tasks: [],
        projectId: project?._id,
        _id: data._id,
      };
      const newProject: Project = {
        ...project,
        sections: [...project.sections, newSection],
      };
      setProject(newProject);
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
      // style={{ width: `calc(100vw - ${sidebarWidth}px)` }}
    >
      {project.sections.map((section, index) => (
        <BoardCard section={section} projectId={paramsProjectId} key={index} />
      ))}
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
