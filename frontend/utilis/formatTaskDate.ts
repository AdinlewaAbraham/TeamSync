const months = [
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
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export default function formatTaskDate(date: Date): string {
  const today = new Date();
  const taskDate = new Date(date);

  const inTheSameYear = today.getFullYear() === taskDate.getFullYear();
  const inTheSameMonth =
    today.getMonth() === taskDate.getMonth() && inTheSameYear;
  const inTheSameWeek =
    inTheSameMonth && taskDate.getDate() - today.getDate() < 6;
  const inTheSameDay = inTheSameMonth && taskDate.getDate() === today.getDate();
  const isYesterday =
    inTheSameMonth && taskDate.getDate() === today.getDate() - 1;
  const isTommorrow =
    inTheSameMonth && taskDate.getDate() === today.getDate() + 1;
  if (inTheSameDay) {
    return "Today";
  }
  if (isTommorrow) {
    return "Tommorrow";
  }
  if (isYesterday) {
    return "Yesterday";
  }
  if (inTheSameWeek) {
    return days[taskDate.getDay()];
  }
  if (inTheSameYear) {
    return `${months[taskDate.getMonth()].substring(
      0,
      3,
    )} - ${taskDate.getDate()}`;
  } else {
    return `${taskDate.getDate()}/${taskDate.getMonth()}/${taskDate.getFullYear()}`;
  }
}
