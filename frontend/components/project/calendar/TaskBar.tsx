import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Task from "@/interfaces/task";
import { BiCheckCircle } from "react-icons/bi";

const TaskBar = ({ task, isLast }: { task: Task; isLast: boolean }) => {
  const [showCheckMark, setShowCheckMark] = useState<boolean>(false);
  return (
    <div
      key={task._id}
      className={`${
        isLast ? "" : "mb-1"
      } bg-bg-primary rounded-lg bg-transparent border-2 w-full border-border-default
       hover:border-accent-blue transition-all duration-150
      px-3 py-1 text-xs h-9 flex items-center cursor-pointer group  `}
      onMouseEnter={() => setShowCheckMark(true)}
      onMouseLeave={() => setShowCheckMark(false)}
      draggable
    >
      <AnimatePresence>
        {showCheckMark && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            exit={{ width: 0 }}
            transition={{ duration: 0.5 }}
            className="group-hover:flex hidden overflow-hidden border justify-center text-[22px] items-center mr-1
       text-gray-500 hover:text-accent-green "
          >
            <BiCheckCircle />
          </motion.div>
        )}
      </AnimatePresence>
      <div>{task.taskName}</div>
    </div>
  );
};

export default TaskBar;
