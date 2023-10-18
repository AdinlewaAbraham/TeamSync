import generateDates from "./generateDates";

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

export default function generateDatesForFourMonths(
  year: number,
  month: number
) {
  let currentYear = year;
  let currentMonth = month;
  const dates = [];
  const numberOfMonths = 4;
  const invalidMonthPrev = currentMonth - 1 < 0;
  const prevMonth = {
    name: invalidMonthPrev ? monthNames[11] : monthNames[currentMonth - 1],
    year: invalidMonthPrev ? currentYear-- : currentYear,
    dates: invalidMonthPrev
      ? generateDates(currentYear--, 11)
      : generateDates(currentYear, currentMonth - 1),
  };
  dates.push(prevMonth);
  for (let i = 0; i < numberOfMonths; i++) {
    const inValidMonthCurrent = currentMonth > 11;
    const nextYear = currentYear + 1;
    const month = {
      name: inValidMonthCurrent ? monthNames[0] : monthNames[currentMonth],
      year: inValidMonthCurrent ? nextYear : currentYear,
      dates: inValidMonthCurrent
        ? generateDates(nextYear, 0)
        : generateDates(currentYear, currentMonth),
    };
    dates.push(month);
    if (inValidMonthCurrent) {
      // reset
      currentYear++;
      currentMonth = 0;
    }
    currentMonth++;
  }

  return dates;
}
