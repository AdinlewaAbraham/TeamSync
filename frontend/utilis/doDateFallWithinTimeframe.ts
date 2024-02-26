import { Timeframe } from "@/interfaces/timeframe";

export default function doDateFallWithinTimeframe(
  timeframe: Timeframe,
  date: Date,
): boolean {
  const dateToStart = new Date(timeframe.dateToStart);
  const dueDate = new Date(timeframe.dueDate);
  const _date = new Date(date);

  return _date >= dateToStart && _date <= dueDate;
}
