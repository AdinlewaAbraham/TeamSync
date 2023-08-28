"use client";
import { NavbarItem } from "@/app/workspace/[workspaceId]/layout";
import React, { ReactNode, useEffect } from "react";

const layout = ({
  params,
  children,
}: {
  params: { projectId: string };
  children: ReactNode;
}) => {
  useEffect(() => {
    const validateProjectId = () => {};
    validateProjectId();
  }, []);

  return (
    <section>
      <nav className="w-full p-4 pb-0 border-b border-border-default">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-slate-400 rounded-full mr-2" />
          <h1 className="text-xl">project name here</h1>
        </div>
        <ul
          className="flex rounded-lg p-2 pl-0 pb-0
      "
        >
          {[
            "Home",
            "Calendar",
            "Dashboard",
            "list",
            "overview",
            "timeline",
            "workflow",
            "files",
            "messages",
          ].map((item) => (
            <div key={item}>
              <NavbarItem title={item} activeWorkspaceId={params.projectId} />
            </div>
          ))}
        </ul>
      </nav>
      this will redirct to overview if the projectid is verified
      <br />
      {params.projectId}
      <main className=" h-[calc(100dvh-200px)]">{children}</main>
    </section>
  );
};

export default layout;
