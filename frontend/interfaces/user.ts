import Workspace from "./workspace";

export default interface User {
  _id: string;
  userName: string;
  email: string;
  name: string;
  userDisplayImage: string;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  privateNote: string;
}
