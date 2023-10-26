import Section from "./section";

export default interface Project {
  projectName: string;
  dueDate: Date;
  description: string;
  projectRoles: object;
  projectResources: object[];
  projectStatus: ""|""|"" | undefined;
  projectDueDate: Date ;
  members: string[];
  sections: (string | Section)[];
  _id: string;
  workspaceId: string;
}
