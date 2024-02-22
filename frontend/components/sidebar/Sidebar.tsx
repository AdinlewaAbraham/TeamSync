"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/globals.css";
import { BiHomeAlt2 } from "react-icons/bi";
import { LuClipboardCheck } from "react-icons/lu";
import { FaChartLine } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import MainLayoutDropDownComponent from "./MainLayoutDropDownComponent";
import ProjectMainSection from "./project/ProjectMainSection";
import WorkspaceMainsection from "./workspace/WorkspaceMainsection";
import fetchWorkspace from "@/helpers/workspace/fetchWorkspace";
import SidebarIconComponent from "./SidebarIconComponent";
import { usePopper } from "react-popper";
import SortOptions from "./project/SortOptions";
import WorkspacePicker from "./WorkspacePicker";
import { GoInbox } from "react-icons/go";
import MainLayoutSidebarLoadingComponent from "../loading/sidebar/MainLayoutSidebarLoadingComponent";

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
    <Link href={redirectLink.toLowerCase()}>
      <div
        className={` focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex
        h-9 w-full items-center 
        justify-start overflow-hidden
         whitespace-nowrap rounded-lg px-4 py-2
         text-sm font-medium shadow-sm transition-colors hover:bg-menuItem-hover focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none
          disabled:opacity-50 ${
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
  const { sidebarWidth, setSidebarWidth } = useGlobalContext();

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
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
    null,
  );
  const [arrowElement2, setArrowElement2] = useState<HTMLDivElement | null>(
    null,
  );
  const { styles: styles2, attributes: attributes2 } = usePopper(
    referenceElement2,
    popperElement2,
    {
      placement: "right",
      strategy: "fixed",
      modifiers: [{ name: "arrow", options: { element: arrowElement2 } }],
    },
  );
  useEffect(() => {
    if (sidebarWidth <= 200) {
      setSidebarWidth(200);
      localStorage.setItem("localSidebarWidth", JSON.stringify(200));
    } else if (sidebarWidth >= 400) {
      setSidebarWidth(400);
      localStorage.setItem("localSidebarWidth", JSON.stringify(400));
    }
    const handleMouseUp = () => {
      document.body.classList.remove("select-none");
      setIsResizing(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = sidebarWidth + (e.clientX - initialX);
        if (newWidth <= 200) {
          setSidebarWidth(200);
          localStorage.setItem("localSidebarWidth", JSON.stringify(200));
          return;
        }
        if (newWidth >= 400) {
          setSidebarWidth(400);
          localStorage.setItem("localSidebarWidth", JSON.stringify(400));
          return;
        }

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
      const updatedWorkspace = await fetchWorkspace(user.activeWorkspaceId);
      setActiveWorkspace(updatedWorkspace);
    };
    getWorkspace();
  }, [user?.activeWorkspaceId]);

  return (
    <AnimatePresence initial={false}>
      {showSidebar && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: sidebarWidth }}
          exit={{ width: 0 }}
          transition={{ duration: isResizing ? 0 : 0.15 }}
          className="relative flex flex-col justify-between overflow-hidden bg-bg-primary"
          style={{ width: sidebarWidth }}
        >
          {activeWorkspace ? (
            <div className="flex flex-1 flex-col justify-between">
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
                  className={`${
                    isResizing ? "bg-accent-blue" : "bg-transparent"
                  }  absolute bottom-0 right-0 top-0 w-1.5 cursor-col-resize bg-transparent transition-all duration-150 hover:bg-accent-blue`}
                />
                <div className="border-b-[1px] border-border-default p-4">
                  {[
                    {
                      menuName: "Home",
                      redirectLink: "/home/" + user?._id,
                      icon: <BiHomeAlt2 />,
                    },
                    {
                      menuName: "My tasks",
                      redirectLink: "/mytasks/" + user?._id + "/board",
                      icon: <LuClipboardCheck />,
                    },
                    {
                      menuName: "Inbox",
                      redirectLink: "/inbox/" + user?._id,
                      icon: <GoInbox />,
                    },
                  ].map((SidebarComponentObj) => (
                    <SidebarComponent
                      menuName={SidebarComponentObj.menuName}
                      redirectLink={SidebarComponentObj.redirectLink}
                      iconComp={SidebarComponentObj.icon}
                      key={SidebarComponentObj.menuName}
                    />
                  ))}
                </div>
                <MainLayoutDropDownComponent
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
                          <Link href={"/project/new"}>
                            <SidebarIconComponent
                              icon={<IoMdAdd />}
                              toolTipText={"Add project"}
                            />
                          </Link>
                      </div>
                    </div>
                  }
                />
                <MainLayoutDropDownComponent
                  MainComponent={<WorkspaceMainsection />}
                  title={"workspace"}
                  sidebarIconComponent={false}
                />
              </div>

              <WorkspacePicker />
            </div>
          ) : (
            <MainLayoutSidebarLoadingComponent />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
