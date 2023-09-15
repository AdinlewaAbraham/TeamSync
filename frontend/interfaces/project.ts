import List from "./section";

export default interface Project {
  projectName: string;
  dueDate: Date;
  description: string;
  members: string[];
  sections: List[] | string[];
  _id: string;
  workspaceId: string;
}
