import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import WorkspaceMemberCard from "./WorkspaceMemberCard";

const WorkspaceMembersComponent = () => {
  const { activeWorkspace } = useGlobalContext();
  if (activeWorkspace)
    return (
      <div className="w-full rounded-lg border border-border-default bg-bg-primary p-4">
        <header className="pb-4">
          <h2 className="text-xl font-medium">Members{`(${activeWorkspace?.members.length})`}</h2>
        </header>
        <div className="projectMembers">
          <div
            // onClick={() => setShowAddMemberModal(true)}
            className="group flex cursor-pointer items-center rounded-lg p-2 text-muted-dark transition-colors duration-150 hover:bg-menuItem-active"
          >
            <i
              className="group-hover:  mr-2 flex h-[36px] w-[36px] items-center 
          justify-center rounded-full border border-dashed 
         border-muted-dark text-lg group-hover:border-white group-hover:text-white"
            >
              <IoMdAdd />
            </i>
            <span className="">Add member</span>
          </div>
          {activeWorkspace.members.map((member, index) => {
            if (typeof member === "object")
              return <WorkspaceMemberCard member={member} key={index} />;
          })}
        </div>
      </div>
    );
};

export default WorkspaceMembersComponent;
