"use client";
import Project from "@/interfaces/project";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import User from "@/interfaces/user";
import Workspace from "@/interfaces/workspace";
import React, {
  ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";

export type GeneralContextType = {
  showSidebar: boolean;
  setShowSidebar: (c: boolean) => void;
  token: string;
  setToken: (c: string) => void;
  user: User | null;
  setUser: (c: User | null) => void;
  showCreateWorkspaceModal: boolean;
  setShowCreateWorkspaceModal: (c: boolean) => void;
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (c: Workspace | null) => void;
  activeProject: Project | null;
  setActiveProject: (c: Project | null) => void;
  sidebarWidth: number;
  setSidebarWidth: (c: number) => void;
  taskComponentHeight: number;
  setTaskComponentHeight: (c: number) => void;
  taskHoverStatusObj: TaskHoverStatusObj;
  setTaskHoverStatusObj: (c: TaskHoverStatusObj) => void;
  calendarTaskbarHoverStatusObj: { [key: string]: boolean };
  userProject: Project | null;
  setUserProject: (c: Project | null) => void;
};

const GeneralContext = createContext<GeneralContextType>({
  showSidebar: true,
  setShowSidebar: () => {},
  token: "",
  setToken: () => {},
  user: null,
  setUser: () => {},
  showCreateWorkspaceModal: false,
  setShowCreateWorkspaceModal: () => {},
  activeWorkspace: null,
  setActiveWorkspace: () => {},
  activeProject: null,
  setActiveProject: () => {},
  sidebarWidth: 0,
  setSidebarWidth: () => {},
  taskComponentHeight: 0,
  setTaskComponentHeight: () => {},
  taskHoverStatusObj: { shutUpTs: true },
  setTaskHoverStatusObj: () => {},
  calendarTaskbarHoverStatusObj: {},
  userProject: null,
  setUserProject: () => {},
});

export const GeneralContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
    useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null,
  );
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [userProject, setUserProject] = useState<Project | null>(null);

  // const localStoredWidthString = localStorage.getItem("localSidebarWidth");
  // const storedWidth = localStoredWidthString
  //   ? JSON.parse(localStoredWidthString)
  //   : null;
  const [sidebarWidth, setSidebarWidth] = useState(/*storedWidth ?? 200*/ 200);
  const [taskComponentHeight, setTaskComponentHeight] = useState(0);
  const [taskHoverStatusObj, setTaskHoverStatusObj] =
    useState<TaskHoverStatusObj>({ shutUpTs: true });

  const calendarTaskbarHoverStatusObj = {};

  useEffect(() => {
    const localStoredWidthString = localStorage.getItem("localSidebarWidth");
    const storedWidth = localStoredWidthString
      ? JSON.parse(localStoredWidthString)
      : null;
    if (storedWidth) {
      setSidebarWidth(storedWidth);
    }
  }, []);

  return (
    <GeneralContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        token,
        setToken,
        user,
        setUser,
        showCreateWorkspaceModal,
        setShowCreateWorkspaceModal,
        activeWorkspace,
        setActiveWorkspace,
        activeProject,
        setActiveProject,
        sidebarWidth,
        setSidebarWidth,
        taskComponentHeight,
        setTaskComponentHeight,
        taskHoverStatusObj,
        setTaskHoverStatusObj,
        calendarTaskbarHoverStatusObj,
        userProject,
        setUserProject,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
export const useGlobalContext = () => useContext(GeneralContext);
