import React, { useState } from "react";
import TableDropdown from "./TableDropdown";
import Project from "@/interfaces/project";
import { IoMdAdd } from "react-icons/io";
import { redirectToLogin } from "@/helpers/redirect";
import Section from "@/interfaces/section";
import { useGlobalContext } from "@/context/GeneralContext";

const Table = ({
  paramsProjectId,
  project,
}: {
  paramsProjectId: string;
  project: Project | null;
}) => {
  const [sectionName, setSectionName] = useState<string>("");
  const [showAddSectionComponent, setShowAddSectionComponent] =
    useState<boolean>(true);
  if (!project) {
    return <div>loading comp</div>;
  }
  const addSection = async () => {
    setShowAddSectionComponent(true);
    if (sectionName === "") {
      return;
    }
    if (!project) return;
    try {
      const response = await fetch("/api/section/", {
        method: "POST",
        body: JSON.stringify({ sectionName, projectId: project._id }),
      });
      const data = await response.json();
      await redirectToLogin(response.status, data.error);
    } catch (err) {
      // isError = true;
    }
  };
  return (
    <div className="flex flex-1 flex-col pl-8">
      <header className="w-full  bg-inherit ">
        <ul
          className="gutter flex w-full justify-between rounded-t-lg border border-border-default bg-bg-secondary text-sm 
         text-muted-dark [&>li]:w-[20%] [&>li]:py-2"
        >
          <li className="pl-2">Task name</li>
          <li> Assignee</li>
          <li> Due date </li>
          <li> Priority </li>
          <li> Status </li>
        </ul>
      </header>
      <div className="  max-h-full overflow-y-auto">
        {project.sections.map((section, index) => (
          <TableDropdown
            section={section}
            projectId={paramsProjectId}
            // isLast={project.sections.length - 1 === index}
          />
        ))}
      </div>
      <footer className="w-full rounded-b-lg  border border-border-default ">
        {showAddSectionComponent ? (
          <div
            className="flex h-12 cursor-pointer items-center py-2 pl-2 text-muted-dark hover:bg-menuItem-hover"
            onClick={() => setShowAddSectionComponent(false)}
          >
            <i className="mr-2">
              <IoMdAdd />
            </i>
            Add section
          </div>
        ) : (
          <div className="addSectionInput flex h-12 w-full text-sm">
            <input
              type="text"
              autoFocus
              className="text-input h-full w-full border-none bg-transparent pl-8 focus:ring-0"
              placeholder="Write a task name"
              onChange={(e) => setSectionName(e.target.value)}
              onBlur={async () => await addSection()}
            />
          </div>
        )}
      </footer>
    </div>
  );
};

export default Table;
