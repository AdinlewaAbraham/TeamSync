import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";
import { FaLock } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

const ProjectPrivacyComponent = () => {
  const { activeProject } = useGlobalContext();
  if (activeProject)
    return (
      <div>
        <div className="flex w-full gap-2 rounded-lg border border-border-default p-10 ">
          {[
            {
              icon: <FaLock />,
              text: "Private to members",
              objectKey: "private",
            },
            {
              icon: <FaUserGroup />,
              text: "Shared with workspace",
              objectKey: "shared",
            },
          ].map((privacyOption, index) => (
            <div
              className={`${
                privacyOption.objectKey === "private" &&
                activeProject.isProjectPrivate
                  ? "border-accent-blue bg-accent-blue/20 bg-opacity-20 hover:bg-opacity-30"
                  : "border-border-default hover:border-border-default/5"
              } flex w-1/2 cursor-pointer flex-col items-center justify-center 
              rounded-lg border py-4 transition-all duration-150`}
              key={privacyOption.objectKey}
            >
              <i className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-bg-primary">
                {privacyOption.icon}
              </i>
              {privacyOption.text}
            </div>
          ))}
        </div>
      </div>
    );
};

export default ProjectPrivacyComponent;
