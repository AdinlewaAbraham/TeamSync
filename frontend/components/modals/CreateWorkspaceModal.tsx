import { useGlobalContext } from "@/context/GeneralContext";
import User from "@/interfaces/user";
import React, { useEffect, useState } from "react";

const CreateWorkspaceModal = () => {
  const { setShowCreateWorkspaceModal, user, setUser } = useGlobalContext();
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestAncestor = target.closest(".workspaceModal");
      if (!closestAncestor) {
        setShowCreateWorkspaceModal(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const CreateWorkspace = async () => {
    try {
      if (!user?._id)
        console.log("the user object is empty you fucking doughnut");
      const response = await fetch("/api/workspace/", {
        method: "POST",
        body: JSON.stringify({
          workspaceName,
          creatorId: user?._id,
          workspaceDescription,
        }),
      });
      const data = await response.json();
      const newWorkspaces = [...(user?.workspaces || []), data]; 
      const updatedUser: User = {
        ...(user || {}),
        workspaces: newWorkspaces,
        _id: user?._id || "",
        userName: user?.userName || "",
        email: user?.email || "",
        name: user?.name || "",
        userDisplayImage: user?.userDisplayImage || "",
        activeWorkspaceId: user?.activeWorkspaceId || "",
      };
      setUser(updatedUser);

      console.log(user);

    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex w-full h-full fixed justify-center items-center inset-0 modalBG">
      <div className="flex bg-bg-primary workspaceModal p-4">
        <div className="bg-blue-400"></div>
        <div className="grid grid-flow-row gap-y-2">
          CreateWorkspaceModal
          <input
            type="text"
            placeholder="wokspace name"
            className="text-input"
            onChange={(e) => {
              setWorkspaceName(e.target.value);
            }}
          />
          <input type="text" placeholder="add members" className="text-input" />
          <input
            type="text"
            placeholder="workspace description"
            className="text-input"
            onChange={(e) => setWorkspaceDescription(e.target.value)}
          />
          <button
            className="accent-color px-1 py-2 rounded-md"
            onClick={() => CreateWorkspace()}
          >
            create workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
