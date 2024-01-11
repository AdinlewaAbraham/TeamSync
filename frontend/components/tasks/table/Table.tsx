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

  const [tableDropDownInnerwidth, setTableDropDownInnerwidth] = useState(0);
  const tableColumsRenderArrayDefault: TableColumn[] = [
    { title: "Task name", default: true, type: "task_name", width: 430 ,id: "1wdfbeq"},
    { title: "Assignee", default: false, type: "assignee", width: 130 ,id: "1wqhjmd"},
    { title: "Due date", default: false, type: "due_date", width: 130 ,id: "1wqhyj"},
    // { title: "Priority", default: false, type: "priority", width: 130 ,id: "1wqsds"},
    // { title: "Status", default: false, type: "status", width: 130 ,id: "1wqwfrew"},
  ];
  const [tableColumsRenderArray, setTableColumsRenderArray] = useState<
    TableColumn[]
  >(tableColumsRenderArrayDefault);

  const tableDropdownRef = useRef(null);

  useEffect(() => {
    const tableDropdownElement = tableDropdownRef.current;
    if (tableDropdownElement) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const elementWidth = entry.contentRect.width;
          setTableDropDownInnerwidth(elementWidth);
        }
      });
      observer.observe(tableDropdownElement);

      return () => observer.unobserve(tableDropdownElement);
    }
  }, [tableDropdownRef.current]);

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
  return (
    <div className="flex flex-1 flex-col overflow-y-hidden">
      <nav className="flex h-14 items-center justify-between px-8">
        <div className="flex gap-2">
          <div>add task</div>
          <div>filter</div>
          <div>sort</div>
          <div>hide</div>
        </div>
        <div>more options</div>
      </nav>
      <div className="flex flex-1 flex-col ">
        <header className="w-full  bg-inherit px-8">
          <ul
            className="flex h-9 items-center border-y border-border-default
            text-xs text-muted-dark "
            style={{
              maxWidth:
                tableDropDownInnerwidth === 0
                  ? "100%"
                  : tableDropDownInnerwidth,
            }}
          >
            {tableColumsRenderArray.map((tableColumnObject) => (
              <TableHeaderColumn
                tableColumsRenderObject={tableColumnObject}
                tableColumsRenderArray={tableColumsRenderArray}
                setTableColumsRenderArray={setTableColumsRenderArray}
                key={tableColumnObject.type}
              />
            ))}
            <li className="px-2 text-lg">
              <IoMdAdd />
            </li>
          </ul>
        </header>
        <div className="relative flex flex-1">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="relative">
              <div
                className="absolute left-8 right-8 top-1 z-0 h-1 opacity-0 "
                ref={tableDropdownRef}
              />

              {project.sections.map((section, index) => (
                <TableDropdown
                  section={section}
                  projectId={paramsProjectId}
                  isLast={project.sections.length - 1 === index}
                  tableColumsRenderArray={tableColumsRenderArray}
                  key={typeof section === "string" ? section : section._id}
                />
              ))}
            </div>
          </div>
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
    </div>
  );
};

export default Table;
