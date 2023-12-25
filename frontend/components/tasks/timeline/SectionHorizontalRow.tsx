import Section from "@/interfaces/section";
import Task from "@/interfaces/task";
import React, { useEffect, useRef } from "react";
import HorizontalRowsForTaskMapping from "./HorizontalRowsForTaskMapping";
import { TimelineSectionObj } from "@/app/project/[projectId]/tasks/timeline/page";

const SectionHorizontalRow = ({
  section,
  projectId,
  setSelectedDateObject,
  month,
  year,
  taskWithDateRange,
  timelineSectionObj,
  setTimelineSectionObj,
}: {
  section: Section;
  projectId: string;
  setSelectedDateObject: (c: { startDate: Date; endDate: Date } | null) => void;
  month: number;
  year: number;
  taskWithDateRange: (string | Task | undefined)[];
  timelineSectionObj: TimelineSectionObj | undefined;
  setTimelineSectionObj: (c: TimelineSectionObj) => void;
}) => {
  const allTaskInSectionRowNumberArr: (number | undefined)[] = taskWithDateRange
    .filter(
      (task) => typeof task === "object" && task.sectionId === section._id,
    )
    .map((task) => {
      if (typeof task === "object" && typeof task.rowNumber === "number") {
        return task.rowNumber;
      }
    });
  let higestRowNumber = 0;
  for (let i = 0; i < allTaskInSectionRowNumberArr.length; i++) {
    const currentNumber = allTaskInSectionRowNumberArr[i];
    if (typeof currentNumber === "number" && currentNumber > higestRowNumber) {
      higestRowNumber = currentNumber;
    }
  }
  const allSectionTask = taskWithDateRange.filter((task) => {
    if (typeof task !== "object") return false;
    return task.sectionId === section._id;
  });
  const sectionComponent = useRef(null);
  let sectionObj:
    | {
        showComponent: boolean;
        componentHeight: number;
      }
    | undefined;
  if (timelineSectionObj) {
    sectionObj = timelineSectionObj?.[section._id];
  }
  const showSection = sectionObj ? sectionObj.showComponent : false;

  useEffect(() => {
    const sectionComponentElement =
      sectionComponent.current as HTMLElement | null;
    if (sectionComponentElement) {
      const sectionComponentElementRect =
        sectionComponentElement.getBoundingClientRect();
      const newHeight = sectionComponentElementRect.height;

      const newTimelineSectionObj: TimelineSectionObj = {
        ...timelineSectionObj,
        [section._id]: {
          showComponent: showSection,
          componentHeight: newHeight,
        },
      };

      setTimelineSectionObj(newTimelineSectionObj);
    }
  }, [higestRowNumber, showSection]);

  return (
    <div
      className={` w-full border-b border-border-default`}
      ref={sectionComponent}
      // onClick={() => console.log(timelineSectionObj)}
    >
      <div
        className={`${
          !showSection && "h-[52px] bg-bg-primary opacity-70"
        } w-full`}
      >
        {showSection &&
          Array.from({ length: higestRowNumber + 2 }).map(
            (undefined, index) => (
              <HorizontalRowsForTaskMapping
                index={index}
                projectId={projectId}
                setSelectedDateObject={setSelectedDateObject}
                month={month}
                year={year}
                taskWithDateRange={taskWithDateRange}
                sectionTasks={allSectionTask}
                section={section}
              />
            ),
          )}
      </div>
    </div>
  );
};

export default SectionHorizontalRow;
