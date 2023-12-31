import generateDates from "./generateDates";

export const getPrevMonthDays = (month: number, year: number) => {
  if (month === 0) {
    return generateDates(year - 1, 11);
  } else {
    return generateDates(year, month - 1);
  }
};
export const getNextMonthDays = (month: number, year: number) => {
  if (month === 11) {
    return generateDates(year + 1, 0);
  } else {
    return generateDates(year, month + 1);
  }
};
