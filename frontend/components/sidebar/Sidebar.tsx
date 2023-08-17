import { useGlobalContext } from "@/context/GeneralContext";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/globals.css";
import { RiArrowDropDownLine } from "react-icons/ri";
import { BiHomeAlt2 } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";

const SidebarComponent = ({
  menuName,
  redirectLink,
  iconComp,
}: {
  menuName: string;
  redirectLink: string;
  iconComp: React.JSX.Element;
}) => {
  const [pathName, setPathName] = useState<string>("")
  useEffect(() => {
    const pathName: string = window.location.pathname;
    setPathName(pathName)
  }, [])
  
  const currentBaseUrl = window.location.origin;
  console.log(currentBaseUrl);
  return (
    <a href={redirectLink}>
      <div
        className={` text-sm flex items-center p-4 hover:bg-menuItem-hover text-text-muted rounded-md whitespace-nowrap overflow-hidden ${
          pathName.startsWith(redirectLink) && "bg-menuItem-active"
        }`}
      >
        <i className="mr-2 text-muted-dark">{iconComp}</i>
        <p className="text-muted-light">{menuName}</p>
      </div>
    </a>
  );
};

const Sidebar = () => {
  const { showSidebar } = useGlobalContext();
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const [initialX, setInitialX] = useState<number>(0);
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
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

  return (
    <AnimatePresence>
      {showSidebar && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: sidebarWidth }}
          exit={{ width: 0 }}
          transition={{ duration: isResizing ? 0 : 0.15 }}
          className="overflow-hidden bg-bg-primary h-[calc(100dvh-50px)] relative p-4"
          style={{ width: sidebarWidth }}
        >
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
          <div className="p-4">
            <div className="items-center flex">
              <div className="w-10 h-10 rounded-full bg-slate-400 mr-2 "></div>
              <h1>workspace1</h1>
              <RiArrowDropDownLine size={30} />
            </div>
          </div>
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
          {/* projects */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
