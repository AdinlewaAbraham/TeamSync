"use client";
import User from "@/interfaces/user";
import React, { ReactNode, createContext, useState, useContext } from "react";

export type GeneralContextType = {
  showSidebar: boolean;
  setShowSidebar: (c: boolean) => void;
  token: string;
  setToken: (c: string) => void;
  user: User | null;
  setUser: (c: User | null) => void;
  showCreateWorkspaceModal: boolean;
  setShowCreateWorkspaceModal: (c: boolean) => void;
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
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GeneralContext);
