import List from "@/interfaces/list";
import React from "react";
import SidebarIconComponent from "../sidebar/SidebarIconComponent";
import { IoMdAdd } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";

const BoardCard = ({ list }: { list: List | string }) => {
  if (typeof list === "string") return <>loading this is a string </>;
  return (
    <div className="bg-bg-primary h-full rounded-lg w-[280px] py-2 mr-2">
      <header className="flex justify-between items-center px-4 py-2">
        <h1>{list.listName}</h1>
        <div className="flex items-start">
          <SidebarIconComponent
            icon={<IoMdAdd />}
            toolTipText={"Add project"}
          />
          <SidebarIconComponent
            icon={<BsThreeDots />}
            toolTipText="Show options"
          />
        </div>
      </header>
      {/* <section className="p-2"></section> */}
      <footer className=" px-2 cursor-pointer ">
        <div className="flex py-2 px-2 items-center mt-2 hover:bg-menuItem-hover rounded-lg">
          <i className="mr-2">
            <IoMdAdd />
          </i>
          add a task
        </div>
      </footer>
      {/* <div className="border-[0.5px] border-red-400 left-0 right-0 fixed top-[290px] z-50"></div> */}
    </div>
  );
};

export default BoardCard;
