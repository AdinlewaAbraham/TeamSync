"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { ReactElement, ReactNode, useEffect } from "react";
export const NavbarItem = ({
  title,
  activeWorkspaceId,
}: {
  title: string;
  activeWorkspaceId: string;
}) => {
  const pathname = usePathname();
  const lowercaseTitle = title.toLowerCase();
  const isCurrentTab = pathname.endsWith(lowercaseTitle);
  return (
    <Link
      href={"/workspace/" + activeWorkspaceId + "/" + lowercaseTitle}
      key={title}
    >
      <li
        className={` p-2 text-muted-dark hover:text-white transition-colors duration-150 cursor-pointer
      ${isCurrentTab && "border-b-2 text-white"} border-white`}
      >
        {title}
      </li>
    </Link>
  );
};

const layout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceId: string };
}) => {
  const { user } = useGlobalContext();
  const router = useRouter();
  useEffect(() => {
    const checkWorkspaceValidity = () => {
      const arrOfIds = user?.workspaces.map((workspace) => workspace._id);
      if (!arrOfIds?.includes(params.workspaceId)) {
        let redirectToWorkspaceHome;
        if (user?.activeWorkspaceId) {
          redirectToWorkspaceHome = `/workspace/${user?.activeWorkspaceId}/home`;
        } else {
          redirectToWorkspaceHome = `/home`;
        }
        router.push(redirectToWorkspaceHome);
      }
    };

    checkWorkspaceValidity();
  }, [user, params.workspaceId]);

  return (
    <section>
      <nav className="w-full p-4 pb-0 border-b border-border-default">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-slate-400 rounded-full mr-2" />
          <h1 className="text-xl">workspace name here</h1>
        </div>
        <ul
          className="flex rounded-lg p-2 pl-0 pb-0
        "
        >
          {["Home", "Calendar", "Dashboard"].map((item) => (
            <div key={item}>
              <NavbarItem title={item} activeWorkspaceId={params.workspaceId} />
            </div>
          ))}
        </ul>
      </nav>
      <main className=" h-[calc(100dvh-200px)]">{children}</main>
    </section>
  );
};

export default layout;
