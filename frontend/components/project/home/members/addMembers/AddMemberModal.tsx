import Project from "@/interfaces/project";
import React from "react";
import { IoMdClose } from "react-icons/io";
import InviteWithEmail from "./InviteWithEmail";
import MembersComponent from "./MembersComponent";
import { useGlobalContext } from "@/context/GeneralContext";

const AddMemberModal = ({
  setShowAddMemberModal,
}: {
  setShowAddMemberModal: (c: boolean) => void;
}) => {
  const { activeProject } = useGlobalContext();
  if (activeProject)
    return (
      <div className="modalBG fixed inset-0 z-50 flex items-center justify-center py-20">
        <main className="max-h-full w-[80%] max-w-[560px] rounded-lg bg-bg-secondary flex-1 flex flex-col">
          <header className="flex py-3 items-center justify-between border-b border-border-default px-6">
            <h3 className=" text-xl font-medium ">
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
          <div className="max-h-[640px] flex-1 overflow-y-auto">
            <InviteWithEmail />
            <MembersComponent />
          </div>
        </main>
      </div>
    );
};

export default AddMemberModal;
