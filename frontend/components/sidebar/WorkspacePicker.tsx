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

const WorkspaceBar = ({ workspace }: { workspace: Workspace }) => {
  const { user, setUser } = useGlobalContext();
  const isActive = user?.activeWorkspaceId === workspace._id;
  return (
    <Link href={"/workspace/" + workspace._id + "/home"}>
      <div
        className={` ${
          isActive ? " bg-menuItem-active" : "hover:bg-menuItem-hover"
        } cursor-pointer px-3 py-2 rounded-lg flex items-center justify-between w-full `}
      >
        <div className="flex items-center">
          <div className="w-5 h-5 mr-2 bg-slate-400 rounded-full" />
          <p className="whitespace-nowrap">{workspace.name}</p>
        </div>
        {isActive && (
          <i>
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
    null
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
    (workspace) => workspace._id === user?.activeWorkspaceId
  );
  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace._id !== user?.activeWorkspaceId
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
            <div className="flex items-center justify-center w-full  px-4 bg-bg-primary">
              <div className=" workspaceMenu w-full border border-border-default rounded-lg my-2">
                <div className="h-[48px] border-b border-border-default flex items-center pl-4 mb-[2px]">
                  <i className="text-icon-default">
                    <BiSearchAlt2 />
                  </i>
                  <input
                    type="text"
                    placeholder="Search workspace..."
                    className="text-input w-full border-none outline-none focus:ring-0 placeholder:text-muted-dark"
                  />
                </div>
                <div>
                  <h3 className="text-muted-dark px-4 py-1.5 text-sm">
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
                    <h3 className="text-muted-dark px-4 py-1.5 text-sm">
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
                <div className="p-1 flex items-center border-t border-border-default">
                  <div className="cursor-pointer px-3 py-2 rounded-lg flex items-center w-full hover:bg-menuItem-hover whitespace-nowrap">
                    <i className="mr-2">
                      <IoIosAddCircleOutline />
                    </i>
                    Create workspace
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-4 flex items-center justify-between">
        <div
          className={`flex workspaceMenu items-center justify-between w-full p-4  ${
            showWorkpaceMenu ? "bg-menuItem-active" : "hover:bg-menuItem-hover"
          } rounded-lg cursor-pointer`}
          ref={setReferenceElement}
          onClick={() => setShowWorkpaceMenu(!showWorkpaceMenu)}
        >
          <div className="flex items-center whitespace-nowrap mr-2 ">
            <div className="w-8 h-8 bg-slate-400 rounded-full mr-3" />
            {activeWorkspace?.name}
          </div>
          <i>
            <MdOutlineUnfoldMore />
          </i>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePicker;
