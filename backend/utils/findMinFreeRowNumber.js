// remember that rows does not have to be unique it just needs to be unique only if there are two or more task within the same timeframe
function findMinFreeRowNumber(allTasks, SD, DD, currentRowNumber) {
  if (allTasks.length === 0) {
    // console.log("allTasks was empty");

    return 0;
  }
  const startDate = new Date(SD);
  const dueDate = new Date(DD);
  const allTaskThatFallsWithinTimeFrame = allTasks.filter((task) => {
    if (!task.dateToStart || !task.dueDate) return;
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
      if (!task.dateToStart || !task.dueDate) return;
      return task?.rowNumber;
    })
    .filter((rowNumber) => rowNumber || rowNumber === 0);
  if (rowNumbers.length === 0) {
    // console.log("rownumber arr was empty");

    return 0;
  }
  const maxNumberInRowNumbers = Math.max(...rowNumbers);
  for (let i = 0; i < maxNumberInRowNumbers; i++) {
    if (!rowNumbers.includes(i)) {
      return i;
    }
  }

  return maxNumberInRowNumbers + 1 < currentRowNumber
    ? currentRowNumber
    : maxNumberInRowNumbers + 1;
}

module.exports = { findMinFreeRowNumber };
