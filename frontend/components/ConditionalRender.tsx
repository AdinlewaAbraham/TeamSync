import React from "react";

export const RenderPriority = ({ Priority }: { Priority: string }) => {
  switch (Priority) {
    case "null":
      return <></>;
      break;
    case "low":
      return <div className="bg-[#90EE90]">Low</div>;

    case "medium":
      return <div className=" bg-[#FFA500]">Medium</div>;
    case "high":
      return <div className="bg-[#8B0000]">High</div>;
    default:
      break;
  }
};

const RenderStatus = ({ status }: { status: string }) => {
  switch (status) {
    case "null":
      return <></>;
      break;
    case "toDo":
      return <div className="bg-[#B0C4DE]">Todo</div>;

    case "inProgress":
      return <div className="bg-[#FFA500]"> In Progress </div>;
    case "done":
      return <div className="bg-[#008000]">Done</div>;
    default:
      break;
  }
};

export default RenderStatus;
