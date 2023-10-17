export default function calculateDaysBetweenDates(
  startDate: Date,
  endDate: Date
) {
  let daysCount = 0;
  let currentDate = new Date(startDate);

  // Iterate through the dates and add each day
  while (currentDate <= endDate) {
    daysCount++;
    currentDate.setDate(currentDate.getDate() + 1);

    // Check if we've crossed into a new month or year
    if (currentDate.getDate() === 1) {
      // You've crossed into a new month
    }
    if (currentDate.getMonth() === 0 && currentDate.getDate() === 1) {
      // You've crossed into a new year
    }
  }

  return daysCount;
}

