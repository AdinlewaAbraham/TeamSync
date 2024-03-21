export const hasExpired = (date: Date) => {
  return new Date(date).getTime() < new Date().getTime();
};
