export default interface CalendarRowTaskPositionObject {
  [taskId: string]: {
    dateToStart: Date;
    dueDate: Date;
    top: number;
  };
}
