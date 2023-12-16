import Section from "./section";
import User from "./user";

export interface Member {
  role: "manager" | "creator" | "member";
  user: string | User;
  _id: string;
}

export default interface Project {
  projectName: string;
  dueDate: Date;
  description: object | undefined;
  isProjectPrivate: boolean;
  members: Member[];
  admins: string[] | User[];
  projectBrief: object | undefined;
  projectResources: object[];
  projectStatus: "" | "" | "" | undefined;
  projectDueDate: Date;
  sections: (string | Section)[];
  _id: string;
  workspaceId: string;
}
