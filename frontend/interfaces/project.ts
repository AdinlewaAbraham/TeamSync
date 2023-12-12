import Section from "./section";
import User from "./user";

export default interface Project {
  projectName: string;
  dueDate: Date;
  description: object | undefined;
  members: string[]| User[];
  admins: string[]| User[];
  projectBrief: object | undefined;
  projectResources: object[];
  projectStatus: "" | "" | "" | undefined;
  projectDueDate: Date;
  sections: (string | Section)[];
  _id: string;
  workspaceId: string;
}
