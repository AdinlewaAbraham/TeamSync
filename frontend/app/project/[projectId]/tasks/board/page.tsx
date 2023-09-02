"use client";
import BoardCard from "@/components/board/BoardCard";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect } from "react";
import { IoMdAdd } from "react-icons/io";

const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();
  useEffect(() => {
    const fetchProjectFunc = async () => {
      const response = await fetchProject(params.projectId);
      if (!response) {
      } else {
        const { data, status } = response;
        await redirectToLogin(status, data?.error);
        setActiveProject(data);
        localStorage.setItem(params.projectId, JSON.stringify(data));
      }
    };
    const getProject = async () => {
      if (activeProject) return;
      const stringData = localStorage.getItem(params.projectId);
      const project = stringData ? JSON.parse(stringData) : undefined;

      if (project) {
        setActiveProject(project);
      } else {
        await fetchProjectFunc();
      }
    };
    const syncProject = async () => {
      if (!activeProject) return;
      await fetchProjectFunc();
    };
    const resolveFuncSync = async () => {
      await Promise.all([getProject(), syncProject()]);
    };
    resolveFuncSync();
  }, []);

  if (!activeProject) return <>loading state</>;
  return (
    <div className="flex">
      {activeProject.lists.map((list, index) => (
        <div key={index}>
          <BoardCard list={list} projectId={params.projectId} />
        </div>
      ))}
      <div className="w-[280px] px-4 py-2  rounded-lg bg-bg-primary flex items-center h-[60px] hover:bg-menuItem-hover cursor-pointer">
        <i className="mr-2">
          <IoMdAdd />
        </i>
        add section
      </div>
    </div>
  );
};

export default page;
