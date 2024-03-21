import { useGlobalContext } from "@/context/GeneralContext";
import { MdOutlineUnfoldMore } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineCheck } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { AnimatePresence, motion } from "framer-motion";
import Workspace from "@/interfaces/workspace";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import LoadingThemeProvider from "../loading/LoadingThemeProvider";

const WorkspaceBar = ({ workspace }: { workspace: Workspace }) => {
  const { user, setUser } = useGlobalContext();
  const isActive = user?.activeWorkspaceId === workspace._id;
  return (
    <Link href={"/workspace/" + workspace._id + "/home"}>
      <div
        className={` ${
          isActive ? " bg-menuItem-active" : "hover:bg-menuItem-hover"
        } flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 `}
      >
        <div className="flex flex-1 items-center truncate">
          <div className="mr-2 h-5 w-5 flex-shrink-0 rounded-full bg-slate-400" />
          <p className="truncate text-ellipsis whitespace-nowrap">
            {workspace.name}
          </p>
        </div>
        {isActive && (
          <i className="ml-2">
            <AiOutlineCheck />
          </i>
        )}
      </div>
    </Link>
  );
};

const WorkspacePicker = () => {
  const { activeWorkspace, user } = useGlobalContext();

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    strategy: "absolute",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });
  const [showWorkpaceMenu, setShowWorkpaceMenu] = useState<boolean>(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e?.target as HTMLElement;
      if (!target) return;
      if (!target.closest(".workspaceMenu")) {
        setShowWorkpaceMenu(false);
      }
    };
    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);
  const workspaces = user?.workspaces;
  const currentWorkspace = workspaces?.find(
    (workspace) => workspace._id === user?.activeWorkspaceId,
  );
  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace._id !== user?.activeWorkspaceId,
  );
  return (
    <div>
      <AnimatePresence>
        {showWorkpaceMenu && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className=" w-full  overflow-hidden "
          >
            <div className="flex w-full items-center justify-center  bg-bg-primary px-4">
              <div className=" workspaceMenu my-2 w-full rounded-lg border border-border-default">
                <div className="mb-[2px] flex h-[48px] items-center border-b border-border-default pl-4">
                  <i className="text-icon-default">
                    <BiSearchAlt2 />
                  </i>
                  <input
                    type="text"
                    placeholder="Search workspace..."
                    className="text-input w-full border-none outline-none placeholder:text-muted-dark focus:ring-0"
                  />
                </div>
                <div>
                  <h3 className="px-4 py-1.5 text-sm text-muted-dark">
                    Active Workspace
                  </h3>
                  <div className="p-1">
                    {currentWorkspace ? (
                      <WorkspaceBar workspace={currentWorkspace} />
                    ) : (
                      <>loading skeleton</>
                    )}
                  </div>
                  {filteredWorkspaces?.length !== 0 && (
                    <h3 className="px-4 py-1.5 text-sm text-muted-dark">
                      Other Workspaces
                    </h3>
                  )}
                  <div className="p-1">
                    {filteredWorkspaces ? (
                      filteredWorkspaces.map((workspace) => (
                        <div key={workspace._id}>
                          <WorkspaceBar workspace={workspace} />
                        </div>
                      ))
                    ) : (
                      <>loading skeleton</>
                    )}
                  </div>
                </div>
                <div className="flex items-center border-t border-border-default p-1">
                  <div className="flex w-full cursor-pointer items-center whitespace-nowrap rounded-lg px-3 py-2 hover:bg-menuItem-hover">
                    <i className="mr-2">
                      <IoIosAddCircleOutline size={20} />
                    </i>
                    <p className="truncate text-ellipsis"> Create workspace</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-between p-4">
        {activeWorkspace ? (
          <div
            className={`workspaceMenu flex w-full items-center justify-between p-4  ${
              showWorkpaceMenu
                ? "bg-menuItem-active"
                : "hover:bg-menuItem-hover"
            } cursor-pointer rounded-lg`}
            ref={setReferenceElement}
            onClick={() => setShowWorkpaceMenu(!showWorkpaceMenu)}
          >
            <div className="mr-2 flex flex-1 flex-row  items-center truncate whitespace-nowrap ">
              <div className="mr-3 h-8 w-8 flex-shrink-0 rounded-full bg-slate-400" />
              <p className="flex-1 truncate text-ellipsis font-medium">
                {activeWorkspace?.name}
              </p>
            </div>
            <i>
              <MdOutlineUnfoldMore />
            </i>
          </div>
        ) : (
          <LoadingThemeProvider>
            <div className="flex items-center p-4">
              <Skeleton
                borderRadius={9999}
                height={32}
                width={32}
                className="mr-2 "
              />
              <Skeleton
                borderRadius={6}
                height={15}
                width={120}
                className="mx--2 "
              />
            </div>
          </LoadingThemeProvider>
        )}
      </div>
    </div>
  );
};

export default WorkspacePicker;
