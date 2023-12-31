import calculateDaysBetweenDates from "./calculateDaysBetweenDates";
import { getPrevMonthDays } from "./getMonthDays";

type FillMonthsDatesReverse = (
  monthsDates: {
    name: string;
    year: number;
    dates: Date[];
  }[],
  firstDateInArr: Date,
) => {
  dates: Date[][];
  name: string;
  year: number;
}[];

export const fillMonthsDatesReverse: FillMonthsDatesReverse = (
  monthsDates,
  firstDateInArr,
) => {
  const monthsDatesToReturn: {
    name: string;
    year: number;
    dates: Date[][];
  }[] = [];
  let _firstDateInArr: Date = firstDateInArr;
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
  for (let i = monthsDates.length - 1; i >= 0; i--) {
    const currentMonth = monthsDates[i];
    let currentMonthDates = [...currentMonth.dates];
    const currentMonthIndex = monthNames.findIndex(
      (monthName) => monthName === currentMonth.name,
    );
    const doesPrevMonthFirstDateBelongToCurrentMonth =
      _firstDateInArr.getMonth() === currentMonthIndex;

    console.log(_firstDateInArr.getDate());

    const lastDateInCurrentMonth =
      currentMonth.dates[currentMonth.dates.length - 1];
    if (doesPrevMonthFirstDateBelongToCurrentMonth) {
      const numberOfDatesToRemoveFromEndOfMonthDates =
        calculateDaysBetweenDates(_firstDateInArr, lastDateInCurrentMonth);

      // remove the n amount of dates from the end of the dates array "currentMonthDates"
      currentMonthDates = currentMonthDates.slice(
        0,
        -numberOfDatesToRemoveFromEndOfMonthDates,
      );
    }
    // chunk it
    const batchSize = 7;
    const dateBatches: Date[][] = [];
    for (let j = currentMonthDates.length - 1; j >= 0; j -= batchSize) {
      const start = Math.max(0, j - batchSize + 1);
      const end = j + 1;
      const currentBatchSize = end - start;

      if (currentBatchSize < batchSize) {
        const noOfDatesToUnshiftToBatchArr = batchSize - currentBatchSize;
        const prevMonthFromCurrentMonth = getPrevMonthDays(
          currentMonthIndex,
          currentMonth.year,
        );
        const datesTOUnshift: Date[] = prevMonthFromCurrentMonth.slice(
          -noOfDatesToUnshiftToBatchArr,
        );
        const batch: Date[] = [...currentMonthDates.slice(start, end)];
        batch.unshift(...datesTOUnshift);
        dateBatches.unshift(batch);
      } else {
        dateBatches.unshift(currentMonthDates.slice(start, end));
      }
    }
    monthsDatesToReturn.unshift({ ...currentMonth, dates: dateBatches });
    _firstDateInArr = new Date(dateBatches[0][0]);
  }

  return monthsDatesToReturn;
};
