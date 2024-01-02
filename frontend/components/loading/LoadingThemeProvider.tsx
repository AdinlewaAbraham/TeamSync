import React, { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

const LoadingThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SkeletonTheme baseColor="#333" highlightColor="#666">
      {children}
    </SkeletonTheme>
  );
};

export default LoadingThemeProvider;
