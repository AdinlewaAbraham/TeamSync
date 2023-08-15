import { useGlobalContext } from "@/context/GeneralContext";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/globals.css";

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
    <>
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: sidebarWidth }}
            exit={{ width: 0 }}
            transition={{ duration: isResizing ? 0 : 0.15 }}
            className="overflow-hidden bg-red-500 h-[calc(100vh-50px)] relative "
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
              className="absolute right-0 bg-transparent top-0 bottom-0 w-1.5 hover:bg-blue-600 cursor-col-resize"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
