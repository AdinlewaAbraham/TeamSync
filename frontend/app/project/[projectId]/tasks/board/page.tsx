"use client";
import BoardCard from "@/components/board/BoardCard";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import Project from "@/interfaces/project";
import Section from "@/interfaces/section";

const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();
  const [sectionName, setSectionName] = useState<string>("");
  const [showAddSectionComponent, setShowAddSectionComponent] =
    useState<boolean>(false);
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
    if (sectionName === "") {
      return;
    }
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

    setShowAddSectionComponent(false);
  };

  const [isHorizontalOverflow, setIsHorizontalOverflow] = useState(false);

  useEffect(() => {
    const divElement: HTMLElement | null =
      document.getElementById("overflowElement");

    if (divElement) {
      const hasHorizontalOverflow: boolean =
        divElement.scrollWidth > divElement.clientWidth;
      // console.log(hasHorizontalOverflow);
      setIsHorizontalOverflow(hasHorizontalOverflow);
    }
  }, []);

  // useEffect(() => {
  //   const handleClick = (e: MouseEvent) => {
  //     const target = e.target as HTMLElement;
  //     if (!target.closest(".addSectionComponent")) {
  //       addSection();
  //     }
  //   };
  //   window.addEventListener("click", handleClick);
  //   return () => window.removeEventListener("click", handleClick);
  // }, []);

  useEffect(() => {}, []);

  if (!activeProject?.sections) return <>loading statee</>;

  return (
    <div
      className="flex h-[calc(100dvh-229px)] overflow-auto overflow-x scrollBar "
      id="overflowElement"
    >
      {activeProject.sections.map((section, index) => (
        <div key={index}>
          <BoardCard
            section={section}
            projectId={params.projectId}
            isHorizontalOverflow={isHorizontalOverflow}
          />
        </div>
      ))}
      <div>
        {showAddSectionComponent ? (
          <div className="w-[280px] px-2 py-2 pt-0 flex flex-col rounded-lg bg-bg-primary addSectionComponent">
            <div className="h-[60px] flex items-center">
              <input
                type="text"
                autoFocus
                className="text-input w-full"
                onChange={(e) => setSectionName(e.target.value)}
                onBlur={async () => await addSection()}
              />
            </div>

            <div className="overflow-hidden flex items-center mb-1">
              <button
                className="button-default accent-color mr-2"
                onClick={() => {
                  addSection();
                }}
              >
                Add section
              </button>
              <i
                className="text-icon-default hover:text-white transition-colors duration-150 text-2xl p-1 cursor-pointer"
                onClick={() => setShowAddSectionComponent(false)}
              >
                <MdClose />
              </i>
            </div>
          </div>
        ) : (
          <div
            className="w-[280px] px-4 py-2  rounded-lg bg-bg-primary flex items-center h-[60px] hover:bg-menuItem-hover cursor-pointer addSectionComponent"
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
