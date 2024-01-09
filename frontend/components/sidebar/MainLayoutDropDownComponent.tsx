import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import SidebarIconComponent from "./SidebarIconComponent";
import { AnimatePresence, motion } from "framer-motion";

const MainLayoutDropDownComponent = ({
  MainComponent,
  title,
  sidebarIconComponent,
}: {
  MainComponent: React.ReactNode;
  title: string;
  sidebarIconComponent: React.ReactNode;
}) => {
  const localSidebarMainComponentShowObjectString = localStorage.getItem(
    "localSidebarMainComponentRenderObject",
  );
  const localSidebarMainComponentShowObject =
    localSidebarMainComponentShowObjectString
      ? JSON.parse(localSidebarMainComponentShowObjectString)
      : {};

  const [showMainComponent, setShowMainComponent] = useState<boolean>(
    !!localSidebarMainComponentShowObject?.[title],
  );

  const handleShowMainComponentToggle = () => {
    const localSidebarMainComponentShowObjectString = localStorage.getItem(
      "localSidebarMainComponentRenderObject",
    );
    const localSidebarMainComponentShowObject =
      localSidebarMainComponentShowObjectString
        ? JSON.parse(localSidebarMainComponentShowObjectString)
        : {};

    const newLocalSidebarMainComponentShowObject = {
      ...localSidebarMainComponentShowObject,
      [title]: !showMainComponent,
    };
    localStorage.setItem(
      "localSidebarMainComponentRenderObject",
      JSON.stringify(newLocalSidebarMainComponentShowObject),
    );
    setShowMainComponent(!showMainComponent);
  };
  return (
    <section className="group mt-2">
      <header className=" flex cursor-pointer select-none items-center justify-between py-1 pr-2">
        <div
          className="flex items-center"
          onClick={handleShowMainComponentToggle}
        >
          <i
            className={` rounded-lg px-[7px] text-xl text-icon-default transition-all duration-300 group-hover:text-white group-hover:opacity-100 ${
              showMainComponent ? "opacity-0" : "rotate-[-90deg] "
            }  `}
          >
            <IoMdArrowDropdown />
          </i>
          <h3 className="font-medium">{title}</h3>
        </div>
        {sidebarIconComponent}
      </header>
      <AnimatePresence initial={false}>
        {showMainComponent && (
          <motion.main
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden truncate px-4"
          >
            {MainComponent}
          </motion.main>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MainLayoutDropDownComponent;
