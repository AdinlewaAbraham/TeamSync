"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const NavbarItem = ({
  title,
  projectId,
}: {
  title: string;
  projectId: string;
}) => {
  const pathname = usePathname();
  const lowercaseTitle = title.toLowerCase();
  const isCurrentTab = pathname.endsWith(lowercaseTitle);
  return (
    <Link href={"/project/" + projectId + "/" + lowercaseTitle} key={title}>
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
  params,
  children,
}: {
  params: { projectId: string };
  children: ReactNode;
}) => {
  const { user, activeWorkspace, activeProject } = useGlobalContext();
  const router = useRouter();
  useEffect(() => {
    const getProject = async () => {
      const response = await fetchProject(params.projectId);
      if (!response) {
        console.log("something went wrong ");
        return;
      }
      const { data, status } = response;
      if (status === 404 && data.error === "PROJECT_NOT_FOUND") {
        console.log("redirecting");
        router.push("/home"); // or push to disired url
      } else {
        router.push("/project/" + params.projectId + "/home");
      }
    };
    getProject();
  }, []);

  return (
    <section>
      <nav className="w-full p-4 pb-0 border-b border-border-default">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-slate-400 rounded-full mr-2" />
          <h1 className="text-xl">project name here</h1>
        </div>
        <ul className="flex rounded-lg p-2 pl-0 pb-0">
          {[
            "Home",
            "Calendar",
            "Dashboard",
            "list",
            "timeline",
            "workflow",
            "files",
            "messages",
          ].map((item) => (
            <div key={item}>
              <NavbarItem title={item} projectId={params.projectId} />
            </div>
          ))}
        </ul>
      </nav>
      <main className=" h-[calc(100dvh-200px)]">{children}</main>
    </section>
  );
};

export default layout;
