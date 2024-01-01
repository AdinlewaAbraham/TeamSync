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

export default function generateDatesMonths(
  year: number,
  month: number,
  numberOfMonths: number,
): { name: string; year: number; dates: Date[] }[] {
  let currentYear = year;
  let currentMonth = month;
  const dates = [];
  // dates.push(prevMonth);
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
    if (i === 0) {
    }
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
