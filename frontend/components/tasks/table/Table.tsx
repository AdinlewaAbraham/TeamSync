import React, { useEffect, useRef, useState } from "react";
import TableDropdown from "./TableDropdown";
import Project from "@/interfaces/project";
import { IoMdAdd } from "react-icons/io";
import { fetchAndHelpRedirect } from "@/helpers/redirect";
import Section from "@/interfaces/section";
import { useGlobalContext } from "@/context/GeneralContext";
import TableSkeletonLoader from "@/components/loading/tasks/table/TableSkeletonLoader";
import TableHeaderColumn from "./TableHeaderColumn";
import { TableColumn } from "@/interfaces/Table";

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

  const tableDropdownRef = useRef(null);

  useEffect(() => {
    if (tableDropdownRef.current) {
      const tableDropdownElement = tableDropdownRef.current as HTMLElement;
      const handleResize = () => {
        getComputedStyle(tableDropdownElement)
        console.log(tableDropdownElement.clientWidth);
      };
      handleResize();
      tableDropdownElement.addEventListener("resize", handleResize);

      return () =>
        tableDropdownElement.removeEventListener("resize", handleResize);
    }
  }, [tableDropdownRef]);

  const addSection = async () => {
    setShowAddSectionComponent(true);
    if (sectionName === "") {
      return;
    }
    if (!project) return;
    try {
      const response = await fetchAndHelpRedirect("/api/section/", {
        method: "POST",
        body: JSON.stringify({ sectionName, projectId: project._id }),
      });
      const { data, status } = response;
    } catch (err) {
      // isError = true;
    }
  };

  if (!project) {
    return <TableSkeletonLoader />;
  }
  const tableColumns: TableColumn[] = [
    { title: "Task name", default: true, type: "task_name" },
    { title: "Assignee", default: false, type: "assignee" },
    { title: "Due date", default: false, type: "due_date" },
    { title: "Priority", default: false, type: "priority" },
    { title: "Status", default: false, type: "status" },
  ];
  return (
    <div className="flex flex-1 flex-col ">
      <header className="w-full  bg-inherit px-8">
        <ul
          className="gutter flex h-9 w-full items-center justify-between rounded-t-lg border-y border-border-default
         text-xs text-muted-dark "
        >
          {tableColumns.map((tableColumnObject) => (
            <TableHeaderColumn
              tableColumnObject={tableColumnObject}
              key={tableColumnObject.type}
            />
          ))}
        </ul>
      </header>
      <div
        className="relative max-h-full overflow-y-scroll border px-8"
        ref={tableDropdownRef}
      >
        {project.sections.map((section, index) => (
          <TableDropdown
            section={section}
            projectId={paramsProjectId}
            isLast={project.sections.length - 1 === index}
          />
        ))}
      </div>
      <footer className="w-full rounded-b-lg px-8">
        {showAddSectionComponent ? (
          <div
            className="flex h-12 cursor-pointer items-center py-2 pl-2 text-muted-dark hover:bg-menuItem-active"
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
