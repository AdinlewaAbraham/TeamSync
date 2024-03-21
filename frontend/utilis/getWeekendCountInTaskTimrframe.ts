import { Timeframe } from "@/interfaces/timeframe";

export const getWeekendCountInTaskTimrframe = (taskTimeframe: Timeframe) => {
    let weekendCount = 0;

    for (
      let date = new Date(taskTimeframe.dateToStart);
      date <= new Date(taskTimeframe.dueDate);
      date.setDate(date.getDate() + 1)
    ) {
      const dayIndex = date.getDay();
      if (dayIndex === 0 || dayIndex === 6) {
        weekendCount++;
      }
    }

    return weekendCount;
  };
