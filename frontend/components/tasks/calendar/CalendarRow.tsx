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
import { debounce } from "lodash";
import { Timeframe } from "@/interfaces/timeframe";

type Props = {
  project: Project | null;
  dateArr: Date[];
  projectId: string;
  rowIndex: number;
};
const CalendarRow: React.FC<Props> = ({
  project,
  dateArr,
  projectId,
  rowIndex,
}) => {
  const { currentMonth, currentYear, taskWithDateRange } = useCalendarStore();

  const dateArrLastElementDate = new Date(dateArr[dateArr.length - 1]);
  const rowKey = `${dateArrLastElementDate.getFullYear()}${dateArrLastElementDate.getMonth()}${dateArrLastElementDate.getDate()}${rowIndex}`;

  const rowWidthRef = useRef<HTMLElement | null>(null);
  const [rowWidth, setRowWidth] = useState(0);

  useEffect(() => {
    const rowWidthElement = rowWidthRef.current;

    if (rowWidthElement) {
      const debouncedSetRowWidth = debounce((width: number) => {
        setRowWidth(width);
      }, 100);

      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          debouncedSetRowWidth(entry.contentRect.width);
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

  const rowTimeframe = {
    dateToStart: new Date(dateArr[0]),
    dueDate: new Date(dateArr[dateArr.length - 1]),
  };

  const tasksInRow = useMemo(
    () =>
      taskWithDateRange.filter((task) => {
        if (typeof task !== "object") return false;
        const taskStartDate = new Date(task.dateToStart);
        const taskDueDate = new Date(task.dueDate);

        const taskDateTimeframe: Timeframe = {
          dateToStart: taskStartDate,
          dueDate: taskDueDate,
        };

        return doTimeFramesOverlap(rowTimeframe, taskDateTimeframe);
      }),
    [JSON.stringify(taskWithDateRange)],
  );

  return (
    <ul
      className="relative flex [&>*:first-child]:border-l-0"
      onClick={() => console.log(rowKey)}
      key={rowKey}
    >
      {dateArr.map((date, index) => (
        <CalendarBox
          key={index + new Date(date).getMonth()}
          project={project}
          calendarBoxDate={new Date(date)}
          projectId={projectId}
          tasksInRow={tasksInRow}
          rowWidth={rowWidth}
          calendarRowTaskPositionObject={calendarRowTaskPositionObject}
          rowTimeframe={rowTimeframe}
        />
      ))}
      <div
        className="absolute left-0 right-0 h-1 bg-transparent"
        ref={(element) => (rowWidthRef.current = element)}
      />
    </ul>
  );
};

export default CalendarRow;
