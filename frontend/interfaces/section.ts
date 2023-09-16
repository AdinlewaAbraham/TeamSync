import Task from "./task";

export default interface Section {
  sectionName: string;
  tasks: Task[] | string[];
  projectId: string;
  _id: string,
}
