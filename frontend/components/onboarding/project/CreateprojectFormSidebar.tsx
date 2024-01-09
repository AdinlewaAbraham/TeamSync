import { ProjectViewType } from "@/app/project/new/page";
import React, { ReactNode, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FcCalendar, FcTemplate, FcTimeline } from "react-icons/fc";
import TableIcon from "../../../assects/project/table.png";
import BoardIcon from "../../../assects/project/board.png";
import Image from "next/image";

const CreateprojectFormSidebar = ({
  projectName,
  setProjectName,
  projectDefaultView,
  setProjectDefaultView,
}: {
  projectName: string;
  setProjectName: (c: string) => void;
  projectDefaultView: ProjectViewType;
  setProjectDefaultView: (c: ProjectViewType) => void;
}) => {
  const [isPrivate, setisPrivate] = useState(false);
  const views: { type: ProjectViewType; icon: ReactNode }[] = [
    {
      type: "board",
      icon: <Image src={BoardIcon} alt="" width={30} height={30} />,
    },
    {
      type: "table",
      icon: <Image src={TableIcon} alt="" width={30} height={30} />,
    },
    { type: "calendar", icon: <FcCalendar /> },
    { type: "timeline", icon: <FcTimeline /> },
  ];
  return (
    <div
      className="[&>div>label]: mx-16 w-[400px] 
    [&>div>label]:mb-2 [&>div>label]:text-xs [&>div>label]:font-medium [&>div>label]:text-muted-dark 
    [&>div]:my-6 [&>div]:flex [&>div]:flex-col"
    >
      <h1 className="text-2xl">New project</h1>

      <div>
        <label>project name</label>
        <input
          type="text"
          className="text-input"
          onChange={(e) => setProjectName(e.target.value)}
          autoFocus
        />
        {false && (
          <div className="mt-1 text-xs font-thin text-red-400" role="alert">
            Project name is required.
          </div>
        )}
      </div>
      <div>
        <label>Privacy</label>
        <div
          role="button"
          aria-expanded={false}
          aria-haspopup="menu"
          aria-labelledby=""
          className="flex h-9 cursor-pointer items-center justify-between rounded-lg border border-border-default px-4 transition-all duration-150 hover:bg-menuItem-hover"
        >
          <span className="text-sm">
            {isPrivate ? "Private" : "Public"} To My Workspace
          </span>
          <i className="text-muted-dark">
            <RiArrowDropDownLine size={30} />
          </i>
        </div>
      </div>
      <div>
        <label>Default view</label>
        <div className="flex gap-4">
          {views.map((view) => (
            <div
              key={view.type}
              className={`${
                projectDefaultView === view.type
                  ? "border-accent-blue bg-accent-blue/20"
                  : "border-border-default/50 bg-bg-secondary/5 hover:border-border-default"
              } flex h-20 w-24 cursor-pointer select-none flex-col items-center justify-center gap-1 rounded-lg
               border transition-all duration-150`}
              onClick={() => setProjectDefaultView(view.type)}
            >
              <i className="text-3xl">{view.icon}</i>
              <span className="text-sm">
                {view.type[0].toUpperCase() + view.type.substring(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        className={`${
          projectName
            ? "cursor-pointer bg-accent-primary text-gray-900"
            : "cursor-default"
        } button-default mb-2 mt-12 w-full rounded-lg border border-border-default text-muted-dark`}
      >
        Create project
      </button>
    </div>
  );
};

export default CreateprojectFormSidebar;
