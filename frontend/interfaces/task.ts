export default interface Task {
  taskName: string;
  description: string;
  assignees: string[];
  dueDate: Date;
  Priority: string;
  status: string;
  comments: string[];
  subTasks: string[];
  members: string[];
  projectId: string;
  isComplete: boolean;
}