import EditableTextComponent from "@/components/others/EditableTextComponent";
import { TableColumn } from "@/interfaces/Table";
import Task from "@/interfaces/task";
import formatTaskDate from "@/utilis/formatTaskDate";
import { motion } from "framer-motion";
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

  const TaskNameTableCell = ({task}:{task: Task}) => {
    const handleTextSave = (text: string) => {
      console.log(text);
    };
    console.log("render");
    return (
      <div className="group flex flex-1 items-center">
        <i
          className={`${
            task.isComplete
              ? "text-accent-green"
              : "text-muted-dark hover:text-accent-green"
          } ml-6 text-lg `}
        >
          <FaRegCircleCheck />
        </i>
        <div className="relative flex h-7 w-full flex-1 items-center">
          <EditableTextComponent
            text={task.taskName}
            handleTextSave={handleTextSave}
            styles="mx-2 p-px group-hover:bg-bg-secondary group-hover:border-gray-500 truncate text-ellipsis"
            containerStyles="absolute inset-0 flex items-center truncate text-ellipsis"
          />
        </div>
      </div>
    );
  };
  const TaskAssigneeTableCell = () => {
    return (
      <div className="flex items-center">
        <div className="mr-2 h-5 w-5 rounded-full bg-slate-600" />
        {"debo"}
      </div>
    );
  };
  const TaskDueDateTableCell = ({task}:{task: Task}) => {
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
      <div>
        {task.dueDate && (
          <div className={`text-xs text-${textColor} `}>
            {formattedTaskDueDate}{" "}
          </div>
        )}
      </div>
    );
  };
  const TaskPriorityTableCell = ({task}:{task: Task}) => {
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
  const TaskStatusTableCell = ({task}:{task: Task}) => {
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

const RenderTableRowCellComponent = ({
  tableColumnRenderObject,
  task,
}: {
  tableColumnRenderObject: TableColumn;
  task: Task;
}) => {
  const renderRowFromRowType = (): ReactNode => {
    switch (tableColumnRenderObject.type) {
      case "task_name":
        return <TaskNameTableCell task={task} />;
      case "assignee":
        return <TaskAssigneeTableCell />;
      case "due_date":
        return <TaskDueDateTableCell task={task}/>;
      case "priority":
        return <TaskPriorityTableCell task={task}/>;
      case "status":
        return <TaskStatusTableCell task={task}/>;
    }
  };

  // const [showToolTip, setShowToolTip] = useState(false);

  // const [referenceElement, setReferenceElement] =
  //   useState<HTMLDivElement | null>(null);
  // const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
  //   null,
  // );
  // const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  // const { styles, attributes } = usePopper(referenceElement, popperElement, {
  //   placement: "top",
  //   strategy: "absolute",
  //   modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  // });
  return (
    <li
      className="tableCellBorder group flex h-full cursor-pointer items-center
      border-r border-border-default px-2"
      style={{ width: tableColumnRenderObject.width || 230 }}
      role="gridcell"
      // ref={setReferenceElement}
    >
      {renderRowFromRowType()}
      {/* {showToolTip && (
        <motion.div
          // initial={{ opacity: 0 }}
          // animate={
          //   showToolTip ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
          // }
          // transition={{ duration: 0, delay: 0.5 }}
          className="whitespace-nowrap rounded-lg bg-menuItem-active p-2 text-xs"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {"hello"}
        </motion.div>
      )} */}
    </li>
  );
};

export default RenderTableRowCellComponent;
