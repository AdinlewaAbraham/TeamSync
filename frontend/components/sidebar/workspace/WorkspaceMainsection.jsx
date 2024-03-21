import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";
import { MdGroup } from "react-icons/md";
import { BiChevronRight } from "react-icons/bi";
import LoadingThemeProvider from "@/components/loading/LoadingThemeProvider";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

const WorkspaceMainsection = () => {
  const { activeWorkspace } = useGlobalContext();
  return (
    <div>
      {activeWorkspace ? (
        <Link href={"/workspace/" + activeWorkspace._id + "/home"}>
          <div className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-sm hover:bg-menuItem-hover ">
            <div className="flex items-center">
              <i className="mr-2 text-lg text-icon-default">
                <MdGroup />
              </i>
              {activeWorkspace.name}
            </div>
            <i className="text-lg text-icon-default">
              <BiChevronRight />
            </i>
          </div>
        </Link>
      ) : (
        <LoadingThemeProvider>
          <div className="px-4">
            <div className="flex h-[36px] items-center py-2">
              <Skeleton
                borderRadius={6}
                height={20}
                width={20}
                className="mr-2 "
              />
              <Skeleton
                borderRadius={4}
                height={10}
                width={134}
                className=" "
              />
            </div>
          </div>
        </LoadingThemeProvider>
      )}
    </div>
  );
};

export default WorkspaceMainsection;
