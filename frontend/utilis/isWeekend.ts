export const isWeekend = (date: Date) => {
  const dateDayIndex = new Date(date).getDay();
  return dateDayIndex === 0 || dateDayIndex === 6;
};
