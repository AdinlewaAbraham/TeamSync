import { useGlobalContext } from "@/context/GeneralContext";
import { redirectToLogin } from "@/helpers/redirect";
import Project from "@/interfaces/project";
import Workspace from "@/interfaces/workspace";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateProjectMOdal = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [noProjectNameErro, setNoProjectNameErro] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { user, setActiveWorkspace, activeWorkspace } = useGlobalContext();

  const handleProjectCreation = async () => {
    setLoading(true);
    if (!user) return;
    const response = await fetch("/api/project/", {
      method: "POST",
      body: JSON.stringify({
        projectName,
        projectDescription,
        workspaceId: user?.activeWorkspaceId,
        creatorId: user?._id
      }),
    });
    const data = await response.json();
    console.log(data);
    await redirectToLogin(response.status, data?.error);
    const Projects = [...(activeWorkspace?.projects || []), data];
    const newWorkspace: Workspace = {
      ...(activeWorkspace || []),
      _id: activeWorkspace?._id || "",
      admins: activeWorkspace?.admins || [],
      creator: activeWorkspace?.creator || "",
      description: activeWorkspace?.description || "",
      members: activeWorkspace?.members || [],

      name: activeWorkspace?.name || "",
      projects: Projects,
    };
    if (data?._id) {
      setActiveWorkspace(newWorkspace);
      if (activeWorkspace?._id) {
        localStorage.setItem(
          activeWorkspace?._id,
          JSON.stringify(newWorkspace)
        );
      }
    }
    setLoading(false);
  };
  return (
    <div className=" flex flex-col gap-y-2 p-4 bg-bg-primary border border-border-default ml-3 z-50">
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
