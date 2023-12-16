import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";
import { MdGroup } from "react-icons/md";
import { BiChevronRight } from "react-icons/bi";
import Link from "next/link";

const WorkspaceMainsection = () => {
  const { activeWorkspace } = useGlobalContext();
  return (
    <Link href={"/workspace/" + activeWorkspace._id + "/home"}>
      <div className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-sm font-medium hover:bg-menuItem-hover ">
        <div className="flex items-center">
          <i className="mr-2 text-lg text-icon-default">
            <MdGroup />
          </i>
          {activeWorkspace?.name}
        </div>
        <i className="text-lg text-icon-default">
          <BiChevronRight />
        </i>
      </div>
    </Link>
  );
};

export default WorkspaceMainsection;
