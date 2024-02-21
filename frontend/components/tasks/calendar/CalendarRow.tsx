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

type Props = {
  project: Project | null;
  dateArr: Date[];
  projectId: string;
  monthIndex: number;
  rowIndex: number;
  taskWithDateRange: (string | Task | undefined)[];
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (c: number) => void;
  setCurrentYear: (c: number) => void;
  showWeekend: boolean;
};
const CalendarRow: React.FC<Props> = ({
  project,
  dateArr,
  projectId,
  monthIndex,
  rowIndex,
  currentMonth,
  currentYear,
  taskWithDateRange,
  setCurrentMonth,
  setCurrentYear,
  showWeekend,
}) => {
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
          date={new Date(date)}
          projectId={projectId}
          highlight={
            new Date(date).getMonth() === currentMonth &&
            new Date(date).getFullYear() === currentYear
          }
          monthIndex={monthIndex}
          rowIndex={rowIndex}
          index={index}
          taskWithDateRange={taskWithDateRange}
          tasksInRow={tasksInRow as Task[]}
          key={index + new Date(date).getMonth()}
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
          rowKey={rowKey}
          rowWidth={rowWidth}
          calendarRowTaskPositionObject={calendarRowTaskPositionObject}
          showWeekend={showWeekend}
        />
      ))}
    </ul>
  );
};

export default CalendarRow;
