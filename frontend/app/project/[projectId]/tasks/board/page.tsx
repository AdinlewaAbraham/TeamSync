"use client";
import BoardCard from "@/components/project/tasks/board/BoardCard";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import Project from "@/interfaces/project";
import Section from "@/interfaces/section";

const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();
  const [sectionName, setSectionName] = useState<string>("");
  const [addingSection, setAddingSection] = useState(false);
  const [showAddSectionComponent, setShowAddSectionComponent] =
    useState<boolean>(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const { sidebarWidth, setTaskComponentHeight } = useGlobalContext();
  useEffect(() => {
    const fetchProjectFunc = async () => {
      const response = await fetchProject(params.projectId);
      if (!response) {
      } else {
        const { data, status } = response;
        await redirectToLogin(status, data?.error);
        // console.log(data);
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
      await redirectToLogin(response.status, data.error);
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
      setActiveProject(newProject);
    } catch (err) {
      // isError = true;
    }

    setAddingSection(false);
    setShowAddSectionComponent(false);
  };

  if (!activeProject?.sections) return <>loading statee</>;

  return (
    <div
      className="overflow-x relative flex flex-1 overflow-auto  px-8 "
      id="overflowElement"
      // style={{ width: `calc(100vw - ${sidebarWidth}px)` }}
    >
      {activeProject.sections.map((section, index) => (
        <BoardCard section={section} projectId={params.projectId} key={index} />
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

export default page;
