"use client";
import React, { ReactNode } from "react";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";
import CreateWorkspaceModal from "./modals/CreateWorkspaceModal";
import { useGlobalContext } from "@/context/GeneralContext";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { showCreateWorkspaceModal } = useGlobalContext();
  return (
    <div className=" ">
      <nav>
        <Navbar />
      </nav>
      <div className="flex">
        <Sidebar />
        <main className="bg-bg-secondary h-[calc(100dvh-50px)] w-full ">
          {children} {showCreateWorkspaceModal && <CreateWorkspaceModal />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
