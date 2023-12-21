import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";

const CreateMenu = ({
  setShowCreateMenu,
}: {
  setShowCreateMenu: (c: boolean) => void;
}) => {
  const { setShowCreateWorkspaceModal } = useGlobalContext();
  return (
    <div className="bg-bg-secondary rounded-lg py-1 border border-border-default">
      <ul className="[&>li>p]:text-sm [&>li]:cursor-pointer [&>li]:p-2 hover:[&>li]:bg-menuItem-active [&>li>p]:text-muted-dark [&>li]:">
        <li
          onClick={() => {
            setShowCreateMenu(false);
          }}
        >
          <h1>Create project</h1>
          <p>this does stuff</p>
        </li>
        <li
          onClick={() => {
            setShowCreateWorkspaceModal(true);
            setShowCreateMenu(false);
          }}
          className="workspaceModal"
        >
          <h1 onClick={() => console.log("create workspace")}>
            Create workspace
          </h1>
          <p>this does stuff</p>
        </li>
      </ul>
    </div>
  );
};

export default CreateMenu;
