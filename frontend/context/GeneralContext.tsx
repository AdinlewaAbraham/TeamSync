"use client";
import React, { ReactNode, createContext, useState, useContext } from "react";

export type GeneralContextType = {
  showSidebar: boolean;
  setShowSidebar: (c: boolean) => void;
  token: string;
  setToken: (c: string) => void;
};

const GeneralContext = createContext<GeneralContextType>({
  showSidebar: true,
  setShowSidebar: () => {},
  token: "",
  setToken: () => {},
});

export const GeneralContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");

  return (
    <GeneralContext.Provider
      value={{ showSidebar, setShowSidebar, token, setToken }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GeneralContext);
