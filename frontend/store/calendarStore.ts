import Task from "@/interfaces/task";
import { create } from "zustand";

export type InputTaskPropObject = {
  _id: string;
  dueDate: Date;
  dateToStart: Date;
};
type CalendarState = {
  showWeekend: boolean;
  setShowWeekend: (c: boolean) => void;
  currentMonth: number;
  setCurrentMonth: (c: number) => void;
  currentYear: number;
  setCurrentYear: (c: number) => void;
  newTaskDuration: number;
  setNewTaskDuration: (c: number) => void;
  taskWithDateRange: (Task | InputTaskPropObject)[];
  setTaskWithDateRange: (c: (Task | InputTaskPropObject)[]) => void;
  newTaskName: string;
  setNewTaskName: (c: string) => void;
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
  newTaskDuration: 3,
  setNewTaskDuration: (newTaskDuration) => set({ newTaskDuration }),
  taskWithDateRange: [],
  setTaskWithDateRange: (taskWithDateRange) => set({ taskWithDateRange }),
  newTaskName: "",
  setNewTaskName: (newTaskName) => set({ newTaskName }),
}));

export function useCalendarStore() {
  return useAuth((state) => state);
}
