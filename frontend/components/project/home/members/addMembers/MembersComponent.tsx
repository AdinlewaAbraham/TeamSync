import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";
import MemberCard from "./MemberCard";
import { FaUserAlt } from "react-icons/fa";
import { MemberRoleSwitch } from "./MemberRoleSwitch";

const MembersComponent = () => {
  const { activeProject } = useGlobalContext();

  if (activeProject)
    return (
      <div className="pb-2 pt-6">
        <header className="px-6 pb-2">
          <h2 className="text-base font-medium">
            Members{`(${activeProject?.members.length})`}
          </h2>
        </header>
        <div>
          <div className="flex px-6 py-2 hover:bg-menuItem-active">
            <div className="mr-2 flex h-[32px] w-[32px] items-center justify-center rounded-full bg-gray-400">
              <i className={`text-black `}>
                <FaUserAlt />
              </i>
            </div>

            <div className="relative mr-px flex-1">
              <div
                className="absolute h-full w-full truncate whitespace-nowrap text-sm [&>span]:block 
                [&>span]:overflow-hidden [&>span]:overflow-ellipsis"
              >
                <span>aaaaaaaaaaaaaaa</span>
                <span className="text-xs text-muted-dark">blah blah blah</span>
              </div>
            </div>
            <MemberRoleSwitch role="editor" memberId="null" />
          </div>
          {activeProject.members.map((member) => {
            if (typeof member === "object")
              return <MemberCard key={member._id} member={member} />;
          })}
        </div>
      </div>
    );
};

export default MembersComponent;
