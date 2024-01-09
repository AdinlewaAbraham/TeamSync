import Task from "@/interfaces/task";
import React, { ReactNode, useState } from "react";
import { BiCircle } from "react-icons/bi";
import { FiCheck, FiLoader } from "react-icons/fi";
import {
  HiOutlineArrowSmDown,
  HiOutlineArrowSmRight,
  HiOutlineArrowSmUp,
} from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { RiTimerLine } from "react-icons/ri";
import { usePopper } from "react-popper";

const TaskRowComponent = ({ task }: { task: Task }) => {
  const [showPriorityMenu, setShowPriorityMenu] = useState<boolean>(false);
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);

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
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const [referenceElement2, setReferenceElement2] =
    useState<HTMLDivElement | null>(null);
  const [popperElement2, setPopperElement2] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement2, setArrowElement2] = useState<HTMLDivElement | null>(
    null,
  );
  const { styles: styles2, attributes: attributes2 } = usePopper(
    referenceElement2,
    popperElement2,
    {
      placement: "bottom",
      modifiers: [{ name: "arrow", options: { element: arrowElement2 } }],
    },
  );
  return (
    <ul
      className="flex h-12 w-full items-center justify-between border-b border-border-default
      text-sm [&>li]:flex [&>li]:w-[20%] [&>li]:px-2"
      key={task._id}
      onClick={() => console.log(task)}
    >
      <li className="">{task.taskName}</li>
      <li className="flex items-center">
        <div className="mr-2 h-5 w-5 rounded-full bg-slate-600" />
        {"debo"}
      </li>
      <li>
        <div></div> sep - 17
      </li>
      <li className="">
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
      <li className="[&>div]:px-2 [&>div]:text-sm ">
        <div
          className="relative flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border
          border-border-default px-2 py-1 text-sm hover:bg-menuItem-hover"
          ref={setReferenceElement2}
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
              ref={setPopperElement2}
              style={styles2.popper}
              {...attributes2.popper}
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
    </ul>
  );
};

export default TaskRowComponent;
