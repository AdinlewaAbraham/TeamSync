import List from "./list";

export default interface Project {
  projectName: string;
  dueDate: Date;
  description: string;
  members: string[];
  lists: List[] | string[];
  _id: string;
  workspaceId: string;
}
