import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CalendarBox from "./CalendarBox";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import Task from "@/interfaces/task";
import Project from "@/interfaces/project";
import CalendarRowTaskPositionObject from "@/interfaces/calendarRowTaskPositionObject";
import doTimeFramesOverlap from "@/utilis/doTimeFramesOverlap";
import { useCalendarStore } from "@/store/calendarStore";

type Props = {
  project: Project | null;
  dateArr: Date[];
  projectId: string;
  monthIndex: number;
  rowIndex: number;
};
const CalendarRow: React.FC<Props> = ({
  project,
  dateArr,
  projectId,
  monthIndex,
  rowIndex,
}) => {
  const {
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,
    taskWithDateRange,
  } = useCalendarStore();

  const dateArrLastElementDate = new Date(dateArr[dateArr.length - 1]);
  const rowKey = `${dateArrLastElementDate.getFullYear()}${dateArrLastElementDate.getMonth()}${dateArrLastElementDate.getDate()}${rowIndex}  `;

  const rowWidthRef = useRef<HTMLElement | null>(null);
  const [rowWidth, setRowWidth] = useState(0);

  useEffect(() => {
    const rowWidthElement = rowWidthRef.current;

    if (rowWidthElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setRowWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(rowWidthElement);

      return () => {
        resizeObserver.unobserve(rowWidthElement);
      };
    }
  }, []);

  const calendarRowTaskPositionObject: CalendarRowTaskPositionObject = useRef(
    {},
  ).current;
  const tasksInRow = useMemo(
    () =>
      taskWithDateRange.filter((task) => {
        if (typeof task !== "object") return false;
        const firstRowDate = new Date(dateArr[0]);
        const lastRowDate = new Date(dateArr[dateArr.length - 1]);
        const taskStartDate = new Date(task.dateToStart);
        const taskDueDate = new Date(task.dueDate);

        const rowDateTimeframe = {
          startDate: firstRowDate,
          dueDate: lastRowDate,
        };
        const taskDateTimeframe = {
          startDate: taskStartDate,
          dueDate: taskDueDate,
        };

        return doTimeFramesOverlap(rowDateTimeframe, taskDateTimeframe);
      }),
    [JSON.stringify(taskWithDateRange)],
  );

  const rowTimeframe = {
    dateToStart: dateArr[0],
    dueDate: dateArr[dateArr.length - 1],
  };
  return (
    <ul
      className="relative flex"
      onClick={() => console.log(tasksInRow.length)}
      key={rowKey}
    >
      <div
        className="absolute left-0 right-0 h-1 bg-transparent"
        ref={(element) => (rowWidthRef.current = element)}
      />
      {dateArr.map((date, index) => (
        <CalendarBox
          project={project}
          calendarBoxDate={new Date(date)}
          projectId={projectId}
          highlight={
            new Date(date).getMonth() === currentMonth &&
            new Date(date).getFullYear() === currentYear
          }
          monthIndex={monthIndex}
          rowIndex={rowIndex}
          tasksInRow={tasksInRow}
          key={index + new Date(date).getMonth()}
          rowKey={rowKey}
          rowWidth={rowWidth}
          calendarRowTaskPositionObject={calendarRowTaskPositionObject}
          rowTimeframe={rowTimeframe}
        />
      ))}
    </ul>
  );
};

export default CalendarRow;
