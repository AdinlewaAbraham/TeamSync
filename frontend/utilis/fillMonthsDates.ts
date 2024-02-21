import { days, properlyIndexedDays } from "@/constants/calendar";
import generateDates from "./generateDates";
import { getNextMonthDays, getPrevMonthDays } from "./getMonthDays";

type FillMonthsDates = (
  monthsDates: {
    name: string;
    year: number;
    dates: Date[];
  }[],
  lastDayPushedProp: Date | null,
) => {
  dates: Date[][];
  name: string;
  year: number;
}[];
export const fillMonthsDates: FillMonthsDates = (
  monthsDates,
  lastDayPushedProp,
) => {
  let lastDayPushed: Date | null = lastDayPushedProp;
  return monthsDates.map((month, index) => {
    const dates: Date[] = JSON.parse(JSON.stringify(month.dates));

    const firstDayInDates = new Date(dates[0]);
    const firstDay = properlyIndexedDays[firstDayInDates.getDay()];
    const noOfDaysToUnshift = days.indexOf(firstDay);
    const prevMonthDays = getPrevMonthDays(
      firstDayInDates.getMonth(),
      firstDayInDates.getFullYear(),
    );
    let daysToUnshit;
    if (lastDayPushed) {
      const currentDate = new Date(lastDayPushed);
      const daysToUnshiftHolderArr = [];
      for (let i = 0; i < noOfDaysToUnshift; i++) {
        // this is meant to be the prev month
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        daysToUnshiftHolderArr.push(newDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      daysToUnshit = daysToUnshiftHolderArr;
      if (daysToUnshit.length !== 0) {
        // remove unwanted begining dates
        const lastdayInDaysToUnshit = new Date(
          daysToUnshit[daysToUnshit.length - 1],
        );
        dates.splice(0, lastdayInDaysToUnshit.getDate());
      }
    } else {
      daysToUnshit =
        noOfDaysToUnshift === 0 ? [] : prevMonthDays.slice(-noOfDaysToUnshift);
    }
    dates.unshift(...daysToUnshit);

    const noOfDaysToPush = 7 - (dates.length % 7);
    if (dates.length % 7 !== 0) {
      const nextMonthDays = getNextMonthDays(
        firstDayInDates.getMonth(),
        firstDayInDates.getFullYear(),
      );
      const daysToFill = nextMonthDays.slice(0, noOfDaysToPush);
      dates.push(...daysToFill);
      lastDayPushed = daysToFill[daysToFill.length - 1];
      if (daysToFill.length === 0) {
        lastDayPushed = null;
      }
    }
    const batchSize = 7;
    const dateBatches = [];

    for (let i = 0; i < dates.length; i += batchSize) {
      dateBatches.push(dates.slice(i, i + batchSize));
    }

    return { ...month, dates: dateBatches };
  });
};
