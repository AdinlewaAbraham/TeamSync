import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import Section from "@/interfaces/section";
import { TimelineSectionObj } from "@/app/project/[projectId]/timeline/page";
import EditableTextComponent from "@/components/others/EditableTextComponent";

const TimelineSideBarItem = ({
  section,
  timelineSectionObj,
  setTimelineSectionObj,
}: {
  section: Section | string;
  timelineSectionObj: TimelineSectionObj | undefined;
  setTimelineSectionObj: (c: TimelineSectionObj) => void;
}) => {
  const [sectionDateObj, setSectionDateObj] = useState({
    showComponent: false,
    componentHeight: 52,
  });
  const sectionId = typeof section === "object" ? section._id : section;
  useEffect(() => {
    if (timelineSectionObj && typeof section === "object") {
      const sectionDate = timelineSectionObj[section._id];
      if (sectionDate) {
        setSectionDateObj(sectionDate);
      }
    }
  }, [timelineSectionObj, sectionId]);

  const handleTextSave = (text: string) => {
    console.log(text);
  };
  if (typeof section !== "object") return <></>;
  return (
    <div
      key={section._id}
      style={{ height: sectionDateObj.componentHeight }}
      className=" overflow-hidden border-b border-border-default"
      onClick={() => console.log(sectionDateObj.componentHeight)}
    >
      <div className=" flex h-[52px] items-center">
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
        <EditableTextComponent
          text={section.sectionName}
          handleTextSave={handleTextSave}
          styles="p-px whitespace-nowrap truncate text-ellipsis group-hover:bg-bg-secondary group-hover:border-gray-500"
          containerStyles="flex flex-1  truncate text-ellipsis"
          key={section.sectionName}
        />
      </div>
    </div>
  );
};

export default TimelineSideBarItem;
