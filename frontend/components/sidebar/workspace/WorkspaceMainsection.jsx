import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";
import { MdGroup } from "react-icons/md";
import { BiChevronRight } from "react-icons/bi";

const WorkspaceMainsection = () => {
  const { activeWorkspace } = useGlobalContext();
  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-menuItem-hover cursor-pointer text-sm font-medium ">
      <div className="flex items-center">
        <i className="mr-2 text-lg text-icon-default">
          <MdGroup />
        </i>
        {activeWorkspace?.name}
      </div>
      <i className="text-icon-default text-lg">
        <BiChevronRight />
      </i>
    </div>
  );
};

export default WorkspaceMainsection;
