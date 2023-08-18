"use client"
import React, { ReactNode } from "react";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

const MainLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className=" ">
      <nav>
        <Navbar />
      </nav>
      <div className="flex">
        <Sidebar />
        <main className="bg-bg-secondary h-[calc(100dvh-50px)] w-full ">
            {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
