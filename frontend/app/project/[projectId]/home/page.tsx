"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect } from "react";
import ProjectDescEditor from "@/components/project/editor/ProjectDescEditor";

const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();

  useEffect(() => {
    const stringData = localStorage.getItem(params.projectId);
    const project = stringData ? JSON.parse(stringData) : undefined;
    if (project) setActiveProject(project);
    const syncProject = async () => {
      const response = await fetchProject(params.projectId);
      if (!response) return;
      const { data, status } = response;
      await redirectToLogin(status, data.error);
      setActiveProject(data);
      localStorage.setItem(params.projectId, JSON.stringify(data));
    };
    syncProject();
  }, []);
  if (!activeProject) return <>loading comp</>;

  
  return (
    <div className=" items-center [&>div>div>h3]:text-[30px] ">
      <div className="p-10">
        <div className="">
          <h3>Project description</h3>
          <ProjectDescEditor />
        </div>
        <div>
          <h3>project Roles</h3>
          <div></div>
        </div>
        <div>
          <h3>Key resources</h3>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default page;
