"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/globals.css";
import { RiArrowDropDownLine } from "react-icons/ri";
import { BiHomeAlt2 } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import DropDownComponent from "./DropDownComponent";
import ProjectMainSection from "./project/ProjectMainSection";
import WorkspaceMainsection from "./workspace/WorkspaceMainsection";
import fetchWorkspace from "@/helpers/fetchWorkspace";
import SidebarIconComponent from "./SidebarIconComponent";
import { usePopper } from "react-popper";
import CreateProjectMOdal from "./project/CreateProjectModal";
import SortOptions from "./project/SortOptions";
import WorkspacePicker from "./WorkspacePicker";

const SidebarComponent = ({
  menuName,
  redirectLink,
  iconComp,
}: {
  menuName: string;
  redirectLink: string;
  iconComp: React.JSX.Element;
}) => {
  const pathname = usePathname();

  return (
    <Link href={redirectLink}>
      <div
        className={` whitespace-nowrap overflow-hidden inline-flex items-center rounded-lg
        text-sm font-medium transition-colors 
        focus-visible:outline-none focus-visible:ring-1
         focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary
         text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 w-full justify-start
          hover:bg-menuItem-hover ${
            pathname.startsWith(redirectLink) && "bg-menuItem-active"
          }`}
      >
        <i className="mr-2 text-icon-default">{iconComp}</i>
        <p className="font-medium">{menuName}</p>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const { showSidebar, activeWorkspace, user, setActiveWorkspace } =
    useGlobalContext();
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [showAddProjectComponent, setShowAddProjectComponent] =
    useState<boolean>(false);
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);

  const [initialX, setInitialX] = useState<number>(0);
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    strategy: "fixed",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const [referenceElement2, setReferenceElement2] =
    useState<HTMLDivElement | null>(null);
  const [popperElement2, setPopperElement2] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement2, setArrowElement2] = useState<HTMLDivElement | null>(
    null
  );
  const { styles: styles2, attributes: attributes2 } = usePopper(
    referenceElement2,
    popperElement2,
    {
      placement: "right",
      strategy: "fixed",
      modifiers: [{ name: "arrow", options: { element: arrowElement2 } }],
    }
  );
  useEffect(() => {
    const locallyStoredSidebarWidth = localStorage.getItem("localSidebarWidth");

    const parsedSidebarWidth =
      locallyStoredSidebarWidth !== null
        ? JSON.parse(locallyStoredSidebarWidth)
        : null;
    if (parsedSidebarWidth) {
      setSidebarWidth(parsedSidebarWidth);
    }
  }, []);
  useEffect(() => {
    const handleMouseUp = () => {
      document.body.classList.remove("select-none");
      setIsResizing(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = sidebarWidth + (e.clientX - initialX);
        if (newWidth <= 200) return;
        if (newWidth >= 400) return;

        setSidebarWidth(newWidth);
        localStorage.setItem("localSidebarWidth", JSON.stringify(newWidth));
        setInitialX(e.clientX);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, sidebarWidth, initialX]);

  useEffect(() => {
    const getWorkspace = async () => {
      if (!user?.activeWorkspaceId) return;
      const workspaceString = localStorage.getItem(user?.activeWorkspaceId);
      const localWorkspace = workspaceString
        ? JSON.parse(workspaceString)
        : null;
      if (localWorkspace) {
        setActiveWorkspace(localWorkspace);
      } else {
        const data = await fetchWorkspace(user?.activeWorkspaceId);
        localStorage.setItem(user?.activeWorkspaceId, JSON.stringify(data));
        setActiveWorkspace(data);
      }
    };
    getWorkspace();
  }, [user?.activeWorkspaceId]);
  useEffect(() => {
    const getWorkspace = async () => {
      if (!user?.activeWorkspaceId) return;
      const workspaceString = localStorage.getItem(user?.activeWorkspaceId);
      const localWorkspace = workspaceString
        ? JSON.parse(workspaceString)
        : null;
      if (localWorkspace) {
        const updatedWorkspace = await fetchWorkspace(user.activeWorkspaceId);
        localStorage.setItem(
          user.activeWorkspaceId,
          JSON.stringify(updatedWorkspace)
        );
        setActiveWorkspace(updatedWorkspace);
      }
    };
    getWorkspace();
  }, [user?.activeWorkspaceId]);

  return (
    <AnimatePresence>
      {showSidebar && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: sidebarWidth }}
          exit={{ width: 0 }}
          transition={{ duration: isResizing ? 0 : 0.15 }}
          className="relative flex flex-col justify-between overflow-hidden bg-bg-primary h-[calc(100dvh-50px)]"
          style={{ width: sidebarWidth }}
        >
          <div>
            <span
              onMouseDown={(e) => {
                document.body.classList.add("select-none");
                setIsResizing(true);
                setInitialX(e.clientX);
              }}
              onMouseUp={() => {
                setIsResizing(false);
                document.body.classList.remove("select-none");
              }}
              className="absolute right-0 bg-transparent top-0 bottom-0 w-1.5 cursor-col-resize"
              style={{ backgroundColor: isResizing ? "blue" : "transparent" }}
            />
            <div className="border-b-[1px] border-border-default p-4">
              <SidebarComponent
                menuName="Home"
                redirectLink="/home"
                iconComp={<BiHomeAlt2 />}
              />
              <SidebarComponent
                menuName="My tasks"
                redirectLink="/mytasks"
                iconComp={<FaTasks />}
              />
              <SidebarComponent
                menuName="Dashboards"
                redirectLink="/dashboards"
                iconComp={<LuLayoutDashboard />}
              />
            </div>
            <DropDownComponent
              MainComponent={<ProjectMainSection />}
              title={"Projects"}
              sidebarIconComponent={
                <div className="grid grid-flow-col ">
                  <div
                    onClick={() => {
                      setShowSortOptions(!showSortOptions);
                    }}
                  >
                    <div ref={setReferenceElement}>
                      <SidebarIconComponent
                        icon={<BsThreeDots />}
                        toolTipText="Show options"
                      />
                    </div>
                    {showSortOptions && (
                      <div
                        ref={setPopperElement}
                        style={styles.popper}
                        {...attributes.popper}
                        className="absolute"
                      >
                        <SortOptions />
                      </div>
                    )}
                  </div>
                  <div>
                    <div
                      ref={setReferenceElement2}
                      onClick={() => {
                        setShowAddProjectComponent(!showAddProjectComponent);
                      }}
                    >
                      <SidebarIconComponent
                        icon={<IoMdAdd />}
                        toolTipText={"Add project"}
                      />
                    </div>
                    {showAddProjectComponent && (
                      <div
                        ref={setPopperElement2}
                        style={styles2.popper}
                        {...attributes2.popper}
                        className="fixed "
                      >
                        <CreateProjectMOdal />
                      </div>
                    )}
                  </div>
                </div>
              }
            />
            <DropDownComponent
              MainComponent={<WorkspaceMainsection />}
              title={"workspace"}
              sidebarIconComponent={false}
            />
          </div>

          <WorkspacePicker />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
