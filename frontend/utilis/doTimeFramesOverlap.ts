interface Timeframe {
  startDate: Date;
  dueDate: Date;
}
export default function doTimeFramesOverlap(
  timeFrame1: Timeframe,
  timeFrame2: Timeframe
) {
  const startDate1 = new Date(timeFrame1.startDate);
  const dueDate1 = new Date(timeFrame1.dueDate);
  const startDate2 = new Date(timeFrame2.startDate);
  const dueDate2 = new Date(timeFrame2.dueDate);

  if (startDate1 <= startDate2 && dueDate1 >= dueDate2) {
    return true;
  } else if (startDate2 <= startDate1 && dueDate2 >= dueDate1) {
    return true;
  }

  if (startDate1 <= dueDate2 && dueDate1 >= startDate2) {
    return true;
  } else if (startDate2 <= dueDate1 && dueDate2 >= startDate1) {
    return true;
  }

  return false;
}
