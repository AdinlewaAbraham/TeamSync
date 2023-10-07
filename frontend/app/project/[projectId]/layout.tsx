"use client";
import EditableComp from "@/components/EditableComp";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { FaChartLine } from "react-icons/fa";
import { LuClipboardCheck } from "react-icons/lu";
import { PiFlowArrowBold } from "react-icons/pi";
import { BiHomeAlt2 } from "react-icons/bi";
import {} from "react-icons/";
import {} from "react-icons/";
import {} from "react-icons/";
import {} from "react-icons/";

const NavbarItem = ({
  title,
  projectId,
  icon,
}: {
  title: string;
  projectId: string;
  icon: ReactNode;
}) => {
  const pathname = usePathname();
  const lowercaseTitle = title.toLowerCase();
  const pathNameFragment = pathname.split("/");
  const isCurrentTab =
    pathname.endsWith(lowercaseTitle) ||
    (lowercaseTitle === "tasks" &&
      pathNameFragment[pathNameFragment.length - 2] === "tasks");
  return (
    <Link href={"/project/" + projectId + "/" + lowercaseTitle} key={title}>
      <li
        className={` flex items-center p-2 text-sm text-muted-dark hover:text-white transition-colors duration-150 cursor-pointer
      ${isCurrentTab && "border-b-2 text-white"} border-white`}
      >
        <i className="mr-1">{icon}</i>
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
        // router.push("/project/" + params.projectId + "/home");
      }
    };
    getProject();
  }, []);

  return (
    <section>
      <nav className="w-full p-4 pb-0 border-b border-border-default">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-slate-400 rounded-full mr-2" />
          {activeProject ? (
            <h1 className="text-xl">
              <EditableComp
                text={activeProject?.projectName}
                styles="px-2 py-1"
              />
            </h1>
          ) : (
            <div className="text-xl">loading</div>
          )}
        </div>
        {activeProject ? (
          <ul className="flex rounded-lg p-2 pl-0 pb-0">
            {[
              { title: "Home", icon: <BiHomeAlt2 /> },
              { title: "Dashboard", icon: <FaChartLine /> },
              { title: "Tasks", icon: <LuClipboardCheck /> },
              { title: "files", icon: <FaChartLine /> },
            ].map((item) => (
              <div key={item.title}>
                <NavbarItem
                  title={item.title}
                  projectId={params.projectId}
                  icon={item.icon}
                />
              </div>
            ))}
          </ul>
        ) : (
          <div className="flex">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>loading</div>
            ))}
          </div>
        )}
      </nav>

      <main className=" h-[calc(100dvh-200px)]">{children}</main>
    </section>
  );
};

export default layout;
