import React from "react";
import SectionHorizontalRow from "./SectionHorizontalRow";
import TimelineVerticalBars from "./TimelineVerticalBars";
import Project from "@/interfaces/project";
import Task from "@/interfaces/task";
import { TimelineSectionObj } from "@/app/project/[projectId]/tasks/timeline/page";

const TimelineMonthComponent = ({
  month,
  activeProject,
  paramProjectId,
  setSelectedDateObject,
  taskWithDateRange,
  timelineSectionObj,
  setTimelineSectionObj,
}: {
  month: { name: string; year: number; dates: Date[] };
  activeProject: Project;
  paramProjectId: string;
  setSelectedDateObject: (
    c: {
      startDate: Date;
      endDate: Date;
    } | null,
  ) => void;
  taskWithDateRange: (string | Task | undefined)[];
  timelineSectionObj: TimelineSectionObj;
  setTimelineSectionObj: (c: TimelineSectionObj) => void;
}) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const TimelineVerticalBarsMinHeight: number = activeProject.sections.reduce(
    (accumulator, section) => {
      const currentSectionHeight =
        typeof section === "object"
          ? timelineSectionObj?.[section._id]?.componentHeight || 0
          : 0;
      return accumulator + currentSectionHeight;
    },
    0,
  );
  return (
    <div
      className="relative flex w-full flex-1"
      style={{ width: 40 * month.dates.length }}
    >
      <div className="absolute z-10 w-full">
        {activeProject.sections.map((section) => {
          if (typeof section !== "object") return;
          return (
            <SectionHorizontalRow
              section={section}
              key={section._id}
              projectId={paramProjectId}
              setSelectedDateObject={setSelectedDateObject}
              month={monthNames.findIndex(
                (monthname) => monthname === month.name,
              )}
              year={month.year}
              taskWithDateRange={taskWithDateRange}
              timelineSectionObj={timelineSectionObj}
              setTimelineSectionObj={setTimelineSectionObj}
            />
          );
        })}
      </div>
      {month.dates.map((day, index) => (
        <TimelineVerticalBars
          day={day}
          setSelectedDateObject={setSelectedDateObject}
          projectId={paramProjectId}
          taskWithDateToStart={taskWithDateRange}
          minHeight={TimelineVerticalBarsMinHeight}
          key={index}
        />
      ))}
    </div>
  );
};

export default TimelineMonthComponent;
