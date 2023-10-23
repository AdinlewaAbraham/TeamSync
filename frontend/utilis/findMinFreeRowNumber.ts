import Task from "@/interfaces/task";
// remember that rows does not have to be unique it just needs to be unique only if there are two or more task within the same timeframe
export default function findMinFreeRowNumber(
  allTasks: (Task | string | undefined)[],
  startDate: Date,
  dueDate: Date,
  currentRowNumber: number
) {
  if (allTasks.length === 0) {
    // console.log("allTasks was empty");

    return 0;
  }
  const allTaskThatFallsWithinTimeFrame = allTasks.filter((task) => {
    if (typeof task !== "object") return;
    const taskDateToStart = new Date(task.dateToStart);
    const taskDueDate = new Date(task.dueDate);
    // console.log(startDate, dueDate, taskDateToStart, taskDueDate)
    return taskDueDate >= startDate && taskDateToStart <= dueDate;
  });
  // console.log(allTaskThatFallsWithinTimeFrame);
  if (allTaskThatFallsWithinTimeFrame.length === 0) {
    // console.log("allTaskThatFallsWithinTimeFrame was empty");
    return 0;
  }
  const rowNumbers = allTaskThatFallsWithinTimeFrame
    .map((task) => {
      if (typeof task !== "object") return;
      return task?.rowNumber;
    })
    .filter((rowNumber): rowNumber is number => typeof rowNumber === "number");

  if (rowNumbers.length === 0) {
    // console.log("rownumber arr was empty");

    return 0;
  }

  for (let i = 0; i < Math.max(...rowNumbers); i++) {
    if (!rowNumbers.includes(i)) {
      return i;
    }
  }

  return Math.max(...rowNumbers) + 1 < currentRowNumber ? currentRowNumber : Math.max(...rowNumbers) + 1 ;
}
