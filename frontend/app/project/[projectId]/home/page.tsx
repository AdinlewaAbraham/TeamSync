"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect } from "react";

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

  return <div>main component</div>;
};

export default page;
