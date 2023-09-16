import Section from "./section";

export default interface Project {
  projectName: string;
  dueDate: Date;
  description: string;
  members: string[];
  sections: (string | Section)[];
  _id: string;
  workspaceId: string;
}
