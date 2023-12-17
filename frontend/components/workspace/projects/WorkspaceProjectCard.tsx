import UserImgComponent from "@/components/user/UserImgComponent";
import Project from "@/interfaces/project";
import React from "react";
import { IoLockClosed } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";

const WorkspaceProjectCard = ({ project }: { project: Project }) => {
  const projectUsersObjArr = project.members.map((member) => member);
  console.log(projectUsersObjArr);
  return (
    <div className="group flex cursor-pointer items-center border-t border-border-default  px-4 py-2 hover:bg-menuItem-hover">
      <div className="mr-2 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-500"></div>
      <div className=" flex h-full w-full flex-col truncate">
        <h4 className=" truncate text-ellipsis">{project.projectName}</h4>
        {project.isProjectPrivate && (
          <div className="flex items-center text-sm text-muted-dark">
            <i className="mr-1">
              <IoLockClosed />
            </i>{" "}
            private
          </div>
        )}
      </div>
      <div>
        {projectUsersObjArr.slice(0, 3).map(({ user }) => {
          if (typeof user === "object")
            return (
              <div>
                <UserImgComponent
                  src={user.userDisplayImage}
                  alt="user img"
                  height={24}
                  width={24}
                  styles="rounded-full"
                />
                {}
              </div>
            );
        })}
      </div>
      <div className="ml-2 opacity-0 group-hover:opacity-100">
        <i className="rounded-lg p-4 text-muted-dark hover:bg-menuItem-hover">
          <BsThreeDots />
        </i>
      </div>
    </div>
  );
};

export default WorkspaceProjectCard;
