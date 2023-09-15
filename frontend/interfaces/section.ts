import Task from "./task";

export default interface Section {
  listName: string;
  tasks: Task[] | string[];
  projectId: string;
}
