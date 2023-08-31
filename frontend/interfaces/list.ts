import Task from "./task";

export default interface List {
  listName: string;
  tasks: Task[] | string[];
  projectId: string;
}
