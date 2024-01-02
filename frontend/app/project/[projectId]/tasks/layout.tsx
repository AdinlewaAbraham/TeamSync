"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaRegCalendar, FaChartLine, FaRegListAlt } from "react-icons/fa";
import {} from "react-icons/";
import { PiFlowArrowBold } from "react-icons/pi";
import {} from "react-icons/";
import { useGlobalContext } from "@/context/GeneralContext";
import socket from "@/config/WebSocketManager";
import Section from "@/interfaces/section";
import Project from "@/interfaces/project";
import project from "@/interfaces/project";
import Task from "@/interfaces/task";
import useTrackProject from "@/hooks/UseTrackProject";
import Skeleton from "react-loading-skeleton";
import LoadingThemeProvider from "@/components/loading/LoadingThemeProvider";

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
  const isCurrentTab = pathname.endsWith(lowercaseTitle);
  return (
    <Link
      href={"/project/" + projectId + "/tasks/" + lowercaseTitle}
      key={title}
    >
      <li
        className={`flex max-w-max cursor-pointer items-center rounded-lg px-3 py-1 text-sm text-muted-dark
         transition-colors duration-150 hover:text-white 
        ${isCurrentTab && "bg-bg-secondary text-white"}`}
      >
        <i
          className={`mr-1 ${title.toLowerCase() === "board" && "rotate-180"} `}
        >
          {icon}
        </i>
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
  params: { projectId: string };
}) => {
  const { activeProject, setActiveProject } = useGlobalContext();
  useTrackProject(params.projectId, activeProject, setActiveProject);
  useEffect(() => {
    const getProject = async () => {
      const response = await fetch("/api/project/" + params.projectId, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setActiveProject(data);
      }
    };
    getProject();
  }, [params.projectId]);

  return (
    <div className="flex h-full flex-1 flex-col ">
      <nav className="ml-8 py-4 ">
        {activeProject ? (
          <ul className="flex h-9 max-w-max items-center justify-center rounded-lg bg-bg-primary p-1">
            {[
              { title: "Board", icon: <BiSolidBarChartAlt2 /> },
              { title: "Table", icon: <FaRegListAlt /> },
              { title: "Calendar", icon: <FaRegCalendar /> },
              { title: "Timeline", icon: <FaChartLine /> },
            ].map((listItem) => (
              <NavbarItem
                title={listItem.title}
                projectId={params.projectId}
                icon={listItem.icon}
                key={listItem.title}
              />
            ))}
          </ul>
        ) : (
          <LoadingThemeProvider>
            <div className="flex h-9 max-w-max items-center justify-center gap-1 rounded-lg bg-bg-primary p-1">
              {[1232, 3423, 2423, 232].map((key) => (
                <div>
                  <Skeleton
                    key={key}
                    height={24}
                    width={76}
                    className="flex items-center"
                  />
                </div>
              ))}
            </div>
          </LoadingThemeProvider>
        )}
      </nav>
      <main className="relative flex-1 overflow-auto">
        <div className="absolute inset-0 flex"> {children}</div>
      </main>
    </div>
  );
};

export default layout;
