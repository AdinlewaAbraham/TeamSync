import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";

const WorkspaceMainsection = () => {
  const { activeWorkspace } = useGlobalContext();
  return <div>{activeWorkspace?.name}</div>;
};

export default WorkspaceMainsection;
