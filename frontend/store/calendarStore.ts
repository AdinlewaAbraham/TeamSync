import { create } from "zustand";

export type CalendarInputBoxObjectType = {
  taskName: string;
  startDate: Date;
  dueDate: Date;
};
 type CalendarInputBoxObject = CalendarInputBoxObjectType | null;

type CalendarState = {
  showWeekend: boolean;
  setShowWeekend: (c: boolean) => void;
  currentMonth: number;
  setCurrentMonth: (c: number) => void;
  currentYear: number;
  setCurrentYear: (c: number) => void;
  calendarInputBoxObject: CalendarInputBoxObject;
  setCalendarInputBoxObject: (c: CalendarInputBoxObject) => void;
  newTaskDuration: number;
  setNewTaskDuration: (c: number) => void;
};

const currentDate = new Date();
const cM = currentDate.getMonth();
const cY = currentDate.getFullYear();

export const useAuth = create<CalendarState>((set, get) => ({
  showWeekend: false,
  setShowWeekend: (showWeekend) => set({ showWeekend }),
  currentMonth: cM,
  setCurrentMonth: (currentMonth) => set({ currentMonth }),
  currentYear: cY,
  setCurrentYear: (currentYear) => set({ currentYear }),
  calendarInputBoxObject: null,
  setCalendarInputBoxObject: (calendarInputBoxObject) =>
    set({ calendarInputBoxObject }),
  newTaskDuration: 3,
  setNewTaskDuration: (newTaskDuration) => set({ newTaskDuration }),
}));

export function useCalendarStore() {
  return useAuth((state) => state);
}
