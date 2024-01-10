import { TableColumn } from "@/interfaces/Table";
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
import RenderTableRowCellComponent from "./RenderTableRowCellComponent";

const TaskRowComponent = ({
  task,
  tableColumsRenderArray,
}: {
  task: Task;
  tableColumsRenderArray: TableColumn[];
}) => {
  return (
    <div className="px-8 hover:bg-menuItem-active">
      <ul
        className="flex h-9 w-full items-center border-b border-border-default text-sm"
        key={task._id}
        onClick={() => console.log(task)}
      >
        {tableColumsRenderArray.map((cell) => (
          <RenderTableRowCellComponent
            task={task}
            tableColumnRenderObject={cell}
            key={cell.type}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskRowComponent;
