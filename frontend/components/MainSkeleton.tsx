import React, { ReactNode } from "react";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

const MainSkeleton = ({children}: {children: ReactNode}) => {
  return (
    <div className=" ">
      <nav>
        <Navbar />
      </nav>
      <div className="flex">
        <Sidebar />
        <main>
            {children}
        </main>
      </div>
    </div>
  );
};

export default MainSkeleton;