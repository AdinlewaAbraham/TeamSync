import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import Section from "@/interfaces/section";
import { TimelineSectionObj } from "@/app/project/[projectId]/tasks/timeline/page";

const TimelineSideBarItem = ({
  section,
  timelineSectionObj,
  setTimelineSectionObj,
}: {
  section: Section | string;
  timelineSectionObj: TimelineSectionObj | undefined;
  setTimelineSectionObj: (c: TimelineSectionObj) => void;
}) => {
  if (typeof section !== "object") return;
  const [sectionDateObj, setSectionDateObj] = useState({
    showComponent: false,
    componentHeight: 52,
  });

  useEffect(() => {
    if (timelineSectionObj) {
      const sectionDate = timelineSectionObj[section._id];
      if (sectionDate) {
        setSectionDateObj(sectionDate);
      }
    }
  }, [timelineSectionObj, section._id]);

  return (
    <div
      key={section._id}
      style={{ height: sectionDateObj.componentHeight }}
      className="border-b border-red-500"
      onClick={() => console.log(sectionDateObj.componentHeight)}
    >
      <div className="flex items-center h-[52px]">
        <i
          className={`cursor-pointer p-2 ${
            sectionDateObj.showComponent ? "rotate-0" : "rotate-[-90deg]"
          }`}
          onClick={() => {
            const newTimelineSectionObj: TimelineSectionObj = {
              ...timelineSectionObj,
              [section._id]: {
                showComponent: !sectionDateObj.showComponent,
                componentHeight: sectionDateObj.componentHeight,
              },
            };

            setTimelineSectionObj(newTimelineSectionObj);
          }}
        >
          <IoMdArrowDropdown />
        </i>
        {section.sectionName}
      </div>
    </div>
  );
};

export default TimelineSideBarItem;
