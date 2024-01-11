import React from "react";
import { IoIosMore, IoMdCalendar } from "react-icons/io";
import SidebarIconComponent from "../sidebar/SidebarIconComponent";

const LayoutHeaderSideComponent = () => {
  return (
    <div className="group flex h-full items-center">
      <div onClick={() => {}}>
        <SidebarIconComponent
          icon={<IoIosMore />}
          toolTipText="Project actions"
          iconStyles="p-2 hover:bg-menuItem-active cursor-pointer text-lg"
        />
      </div>
    </div>
  );
};

export default LayoutHeaderSideComponent;
