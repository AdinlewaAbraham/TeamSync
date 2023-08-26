import { useGlobalContext } from "@/context/GeneralContext";
import { redirectToLogin } from "@/helpers/redirect";
import Project from "@/interfaces/project";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateProjectMOdal = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [noProjectNameErro, setNoProjectNameErro] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { user, setActiveWorkspace, activeWorkspace } = useGlobalContext();

  console.log(activeWorkspace);
  const handleProjectCreation = async () => {
    setLoading(true);
    const response = await fetch("/api/project/", {
      method: "POST",
      body: JSON.stringify({
        projectName,
        projectDescription,
        workspaceId: user?.activeWorkspaceId,
      }),
    });
    const data = await response.json();
    console.log(data);
    await redirectToLogin(response.status, data?.error);
    const project = data;
    const newWorkspace = JSON.parse(JSON.stringify(activeWorkspace));
    newWorkspace.projects = [activeWorkspace?.projects, project];
    setActiveWorkspace(newWorkspace);
    console.log(activeWorkspace);
    setLoading(false);
  };
  return (
    <div className=" flex flex-col gap-y-2 p-4 bg-bg-primary border border-border-default ml-3">
      <h1>create project</h1>
      <input
        type="text"
        placeholder="project name"
        className="text-input"
        onChange={(e) => setProjectName(e.target.value)}
      />
      <input
        type="text"
        placeholder="project description"
        className="text-input"
        onChange={(e) => setProjectDescription(e.target.value)}
      />
      <button
        className="accent-color button-default"
        onClick={handleProjectCreation}
      >
        create project
      </button>
    </div>
  );
};

export default CreateProjectMOdal;
