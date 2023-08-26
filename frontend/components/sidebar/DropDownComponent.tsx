import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import SidebarIconComponent from "./SidebarIconComponent";

const DropDownComponent = ({
  MainComponent,
  title,
  sidebarIconComponent,
}: {
  MainComponent: React.ReactNode;
  title: string;
  sidebarIconComponent: React.ReactNode;
}) => {
  const [showMainComponent, setShowMainComponent] = useState<boolean>(false);
  return (
    <section className="group mt-2">
      <header className=" cursor-pointer flex items-center justify-between select-none pr-2 py-1">
        <div
          className="flex items-center "
          onClick={() => setShowMainComponent(!showMainComponent)}
        >
          <i
            className={` px-[7px] rounded-lg text-xl text-icon-default group-hover:text-white transition-all duration-300 group-hover:opacity-100 ${
              showMainComponent ? "opacity-0" : "rotate-[-90deg] "
            }  `}
          >
            <IoMdArrowDropdown />
          </i>
          <h3 className="font-medium">{title}</h3>
        </div>
        {sidebarIconComponent}
      </header>
      {showMainComponent && (
        <main className="px-4 truncate">{MainComponent}</main>
      )}
    </section>
  );
};

export default DropDownComponent;
