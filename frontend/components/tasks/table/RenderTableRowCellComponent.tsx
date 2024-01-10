import EditableTextComponent from "@/components/others/EditableTextComponent";
import { TableColumn } from "@/interfaces/Table";
import Task from "@/interfaces/task";
import formatTaskDate from "@/utilis/formatTaskDate";
import React, { ReactNode, useState } from "react";
import { BiCircle } from "react-icons/bi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FiCheck, FiLoader } from "react-icons/fi";
import {
  HiOutlineArrowSmDown,
  HiOutlineArrowSmRight,
  HiOutlineArrowSmUp,
} from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { RiTimerLine } from "react-icons/ri";
import { usePopper } from "react-popper";

const RenderTableRowCellComponent = ({
  tableColumnRenderObject,
  task,
}: {
  tableColumnRenderObject: TableColumn;
  task: Task;
}) => {
  const TaskNameTableCell = () => {
    const hanldeTextSave = (text: string) => {
      console.log(text);
    };
    return (
      <li className="group">
        <i
          className={`${
            task.isComplete
              ? "text-accent-green"
              : "text-muted-dark hover:text-accent-green"
          } ml-6 text-lg `}
        >
          <FaRegCircleCheck />
        </i>
        <EditableTextComponent
          text={task.taskName}
          handleTextSave={hanldeTextSave}
          styles="mx-2 max-w-max p-px group-hover:bg-bg-secondary group-hover:border-gray-500"
          key={task.taskName}
        />
      </li>
    );
  };
  const TaskAssigneeTableCell = () => {
    return (
      <li className="flex items-center">
        <div className="mr-2 h-5 w-5 rounded-full bg-slate-600" />
        {"debo"}
      </li>
    );
  };
  const TaskDueDateTableCell = () => {
    const taskDueDate = new Date(task.dueDate);
    const today = new Date();
    const formattedTaskDueDate = formatTaskDate(taskDueDate);
    const textColor =
      taskDueDate < today && formattedTaskDueDate !== "Today"
        ? "red-400"
        : formattedTaskDueDate === "Today" ||
            formattedTaskDueDate === "Tommorrow"
          ? "accent-green"
          : "muted-dark";
    return (
      <li>
        {task.dueDate && (
          <div className={`text-xs text-${textColor} `}>
            {formattedTaskDueDate}{" "}
          </div>
        )}
      </li>
    );
  };
  const TaskPriorityTableCell = () => {
    interface PriorityObj {
      [key: string]: {
        color: string;
        text: string;
        icon: ReactNode;
      };
    }
    const priorityObj: PriorityObj = {
      null: {
        color: "#aaa",
        text: "Not selected",
        icon: <BiCircle />,
      },
      low: { color: "#90EE90", text: "Low", icon: <HiOutlineArrowSmDown /> },
      medium: {
        color: "#FFA500",
        text: "Medium",
        icon: <HiOutlineArrowSmRight />,
      },
      high: { color: "#8B0000", text: "High", icon: <HiOutlineArrowSmUp /> },
    };
    const [showPriorityMenu, setShowPriorityMenu] = useState(false);
    const [referenceElement, setReferenceElement] =
      useState<HTMLDivElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
      null,
    );
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(
      null,
    );

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    });
    return (
      <li>
        <div
          className="relative flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border
        border-border-default px-2 py-1 text-sm hover:bg-menuItem-hover"
          ref={setReferenceElement}
          onClick={() => {
            setShowPriorityMenu(!showPriorityMenu);
          }}
        >
          <div className="flex items-center">
            <i className="mr-2">{priorityObj[task.Priority].icon}</i>
            {priorityObj[task.Priority].text}
          </div>
          <i className="ml-2 text-muted-dark">
            <IoIosArrowDown />
          </i>
          {showPriorityMenu && (
            <div
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              className="z-50 w-[calc(100%+1px)] rounded-lg border border-border-default bg-bg-secondary"
            >
              {Object.values(priorityObj).map((priority) => (
                <div
                  className="flex h-9 w-full items-center  
                px-2 py-1 text-sm"
                  key={priority.text}
                >
                  <div className="flex w-full  cursor-pointer items-center rounded-lg px-2 py-1 hover:bg-menuItem-hover">
                    <i className="mr-2">{priority.icon}</i>
                    {priority.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </li>
    );
  };
  const TaskStatusTableCell = () => {
    interface StatusObj {
      [key: string]: {
        color: string;
        text: string;
        icon: ReactNode;
      };
    }
    const statusObj: StatusObj = {
      null: {
        color: "#aaa",
        text: "Not selected",
        icon: <BiCircle />,
      },
      toDo: { color: "#B0C4DE", text: "Todo", icon: <FiLoader /> },
      inProgress: {
        color: "#FFA500",
        text: "In Progress",
        icon: <RiTimerLine />,
      },
      done: { color: "#008000", text: "Done", icon: <FiCheck /> },
    };

    const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
    const [referenceElement, setReferenceElement] =
      useState<HTMLDivElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
      null,
    );
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(
      null,
    );

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    });
    return (
      <li>
        <div
          className="relative flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border
      border-border-default px-2 py-1 text-sm hover:bg-menuItem-hover"
          ref={setReferenceElement}
          onClick={() => {
            setShowStatusMenu(!showStatusMenu);
          }}
        >
          <div className="flex items-center">
            <i className="mr-2">{statusObj[task.status].icon}</i>

            {statusObj[task.status].text}
          </div>
          <i className="ml-2 text-muted-dark">
            <IoIosArrowDown />
          </i>
          {showStatusMenu && (
            <div
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              className="z-50 w-[calc(100%+3px)] rounded-lg border border-border-default bg-bg-secondary"
            >
              {Object.values(statusObj).map((status, index) => (
                <div
                  className="flex w-full items-center
                px-2 py-1 text-sm"
                  key={status.text + index}
                >
                  <div className=" flex w-full  cursor-pointer items-center rounded-lg px-2 py-1 hover:bg-menuItem-hover">
                    <i className="mr-2">{status.icon}</i>
                    {status.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </li>
    );
  };

  const renderRowFromRowType = (): ReactNode => {
    switch (tableColumnRenderObject.type) {
      case "task_name":
        return <TaskNameTableCell />;
      case "assignee":
        return <TaskAssigneeTableCell />;
      case "due_date":
        return <TaskDueDateTableCell />;
      case "priority":
        return <TaskPriorityTableCell />;
      case "status":
        return <TaskStatusTableCell />;
    }
  };

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    strategy: "absolute",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });
  return (
    <div
      className="tableCellBorder group h-full cursor-pointer [&>li]:flex [&>li]:h-full [&>li]:items-center
      [&>li]:border-r [&>li]:border-border-default [&>li]:px-2"
      style={{ width: tableColumnRenderObject.width || 230 }}
      role="gridcell"
      ref={setReferenceElement}
    >
      {renderRowFromRowType()}
      <div
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="hidden group-hover:flex"
      >
        hello
      </div>
    </div>
  );
};

export default RenderTableRowCellComponent;
