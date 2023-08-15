"use client";
import React, {
  ReactNode,
  createContext,
  useState,
  useContext,
} from "react";

export type GeneralContextType = {
  showSidebar: boolean;
  setShowSidebar: (c: boolean) => void;
};

const GeneralContext = createContext<GeneralContextType>({
  showSidebar: true,
  setShowSidebar: () => {},
});

export const GeneralContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  return (
    <GeneralContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GeneralContext);
