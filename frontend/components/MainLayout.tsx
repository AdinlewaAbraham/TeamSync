"use client";
import React, { ReactNode, useEffect } from "react";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";
import CreateWorkspaceModal from "./modals/CreateWorkspaceModal";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchUser from "@/helpers/fetchUser";
import fetchWorkspace from "@/helpers/fetchWorkspace";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { showCreateWorkspaceModal, setUser, user, setActiveWorkspace } =
    useGlobalContext();

  useEffect(() => {
    const getUser = async () => {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (user) {
        setUser(user);
      } else {
        const user = await fetchUser();
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      }
    };
    getUser();
  }, []);
  // useEffect(() => {
  //   console.log("fetching workspace");
  //   const getActiveWorkspace = async () => {
  //     if (!user) return;
  //     const workspace = await fetchWorkspace(user.activeWorkspaceId);
  //     setActiveWorkspace(workspace);
  //   };
  //   getActiveWorkspace();
  // }, [user]);

  useEffect(() => {
    const updateUser = async () => {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (user) {
        const updatedUser = await fetchUser();
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    };
    updateUser();
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <nav className="">
        <Navbar />
      </nav>
      <div className="flex flex-1 ">
        <Sidebar />
        <main className="bg-bg-secondary flex-1 flex overflow-y-auto">
          {children}
          {showCreateWorkspaceModal && <CreateWorkspaceModal />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
