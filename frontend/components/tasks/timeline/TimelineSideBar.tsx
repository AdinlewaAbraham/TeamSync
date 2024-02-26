import React, { MutableRefObject } from "react";
import TimelineSideBarItem from "./TimelineSideBarItem";
import Section from "@/interfaces/section";
import { TimelineSectionObj } from "@/app/project/[projectId]/timeline/page";

type Props = {
  sidebarRef: MutableRefObject<null>;
  sections: Array<Section | string>;
  timelineSectionObj: TimelineSectionObj;
  setTimelineSectionObj: (c: TimelineSectionObj) => void;
};
const TimelineSideBar: React.FC<Props> = ({
  sidebarRef,
  sections,
  timelineSectionObj,
  setTimelineSectionObj,
}) => {
  console.log(timelineSectionObj);
  return (
    <div className=" h-full flex-1 overflow-y-hidden border-r border-border-default">
      <div className="relative flex-1 overflow-y-hidden" ref={sidebarRef}>
        {sections.map((section) => (
          <TimelineSideBarItem
            section={section}
            timelineSectionObj={timelineSectionObj}
            setTimelineSectionObj={setTimelineSectionObj}
            key={typeof section === "string" ? section : section._id}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineSideBar;
