import Section from "./section";

export default interface Project {
  projectName: string;
  dueDate: Date;
  description: object | undefined;
  projectBrief: object | undefined;
  projectRoles: object;
  projectResources: object[];
  projectStatus: "" | "" | "" | undefined;
  projectDueDate: Date;
  members: string[];
  sections: (string | Section)[];
  _id: string;
  workspaceId: string;
}
