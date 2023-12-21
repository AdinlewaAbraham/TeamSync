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
        className={`flex items-center text-sm px-3 py-1 max-w-max rounded-lg text-muted-dark hover:text-white
         transition-colors duration-150 cursor-pointer 
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
  const observerRef = useRef<ResizeObserver | null>(null);
  const { setTaskComponentHeight } = useGlobalContext();


  return (
    <div className="flex-1 flex flex-col h-full ">
      <nav className="py-4 ml-8 ">
        <ul className="max-w-max h-9 flex justify-center items-center p-1 bg-bg-primary rounded-lg">
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
      </nav>
      <main className="flex-1 relative overflow-auto" >
        <div className="absolute inset-0 flex"> {children}</div>
      </main>
    </div>
  );
};

export default layout;
