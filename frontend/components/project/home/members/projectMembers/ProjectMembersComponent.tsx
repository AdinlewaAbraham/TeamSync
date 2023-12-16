import React, { useState } from "react";
import MemberCard from "./MemberCard";
import Project from "@/interfaces/project";
import { IoMdAdd } from "react-icons/io";
import AddMemberModal from "../addMembers/AddMemberModal";

const ProjectMembersComponent = ({
  activeProject,
}: {
  activeProject: Project;
}) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  return (
    <div className="projectMembers">
      {showAddMemberModal && (
        <AddMemberModal setShowAddMemberModal={setShowAddMemberModal} />
      )}
      <div
        onClick={() => setShowAddMemberModal(true)}
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
      {Array(5)
        .fill(activeProject.members[0])
        .map((member) => {
          if (typeof member === "object") return <MemberCard member={member} />;
        })}
    </div>
  );
};

export default ProjectMembersComponent;
