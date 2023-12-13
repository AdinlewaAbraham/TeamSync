import Project from "@/interfaces/project";
import React from "react";
import { IoMdClose } from "react-icons/io";
import InviteWithEmail from "./InviteWithEmail";
import MembersComponent from "./MembersComponent";

const AddMemberModal = ({
  activeProject,
  setShowAddMemberModal,
}: {
  activeProject: Project;
  setShowAddMemberModal: (c: boolean) => void;
}) => {
  return (
    <div className="modalBG fixed inset-0 flex items-center justify-center py-20 ">
      <main className="max-h-max w-[80%] max-w-[560px] rounded-lg border bg-bg-secondary ">
        <header className="flex h-16 items-center justify-between border-b border-border-default px-6">
          <h3 className=" text-xl font-medium">
            Share {activeProject.projectName}
          </h3>
          <i
            className="cursor-pointer rounded-lg p-2 text-lg hover:bg-menuItem-active"
            onClick={() => {
              setShowAddMemberModal(false);
            }}
          >
            <IoMdClose />
          </i>
        </header>
        <div className="max-h-[640px] ">
          <InviteWithEmail />
          <MembersComponent />
        </div>
      </main>
    </div>
  );
};

export default AddMemberModal;
