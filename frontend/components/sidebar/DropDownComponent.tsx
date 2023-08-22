import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import SidebarIconComponent from "./SidebarIconComponent";

const DropDownComponent = ({
  MainComponent,
  AddComponent,
  MoreComponent,
  title,
}: {
  MainComponent: React.ReactNode;
  AddComponent: React.ReactNode;
  MoreComponent: React.ReactNode;
  title: string;
}) => {
  const [showMainComponent, setShowMainComponent] = useState<boolean>(false);
  return (
    <section className="group mt-2">
      <header className="cursor-pointer flex items-center justify-between select-none pr-2">
        <div
          className="flex items-center "
          onClick={() => setShowMainComponent(!showMainComponent)}
        >
          <i
            className={` px-[7px] rounded-md text-lg transition-all duration-200 group-hover:opacity-100 ${
              showMainComponent ? "opacity-0" : "rotate-[-90deg] "
            }  `}
          >
            <IoMdArrowDropdown />
          </i>
          <h3>{title}</h3>
        </div>
        <div className="grid grid-flow-col ">
          <SidebarIconComponent
            icon={<BsThreeDots />}
            toolTipText="Show options"
          />
          <SidebarIconComponent
            icon={<IoMdAdd />}
            toolTipText={"Add " + title}
          />
        </div>
      </header>
      {showMainComponent && <main className="px-8 truncate">{MainComponent}</main>}
    </section>
  );
};

export default DropDownComponent;
