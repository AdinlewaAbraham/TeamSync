"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaRegCalendar, FaChartLine, FaRegListAlt } from "react-icons/fa";
import {} from "react-icons/";
import { PiFlowArrowBold } from "react-icons/pi";
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
  return (
    <div className="px-8 py-4 ">
      <nav>
        <ul className="max-w-max h-9 flex justify-center items-center p-1 bg-bg-primary rounded-lg">
          {[
            { title: "Board", icon: <BiSolidBarChartAlt2 /> },
            { title: "Table", icon: <FaRegListAlt /> },
            { title: "Calendar", icon: <FaRegCalendar /> },
            { title: "timeline", icon: <FaChartLine /> },
            { title: "workflow", icon: <PiFlowArrowBold /> },
          ].map((listItem) => (
            <NavbarItem
              title={listItem.title}
              projectId={params.projectId}
              icon={listItem.icon}
            />
          ))}
        </ul>
      </nav>
      <main className="mt-6">{children}</main>
    </div>
  );
};

export default layout;
