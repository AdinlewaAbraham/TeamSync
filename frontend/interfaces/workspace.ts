export default interface Workspace {
  _id: string;
  name: string;
  members: string[];
  admins: string[];
  creator: string;
  projects: string[];
  description: string
}
