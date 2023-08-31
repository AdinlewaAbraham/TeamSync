"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

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
    <Link
      href={"/project/" + projectId + "/tasks/" + lowercaseTitle}
      key={title}
    >
      <li
        className={`text-sm px-3 py-1 max-w-max rounded-lg text-muted-dark hover:text-white
         transition-colors duration-150 cursor-pointer 
        ${isCurrentTab && "bg-bg-secondary text-white"}`}
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
  params: { projectId: string };
}) => {
  return (
    <div className="px-8 py-4 ">
      <nav>
        <ul className="max-w-max h-9 flex justify-center items-center p-1 bg-bg-primary rounded-lg">
          {["Board", "Table"].map((listItem) => (
            <NavbarItem title={listItem} projectId={params.projectId} />
          ))}
        </ul>
      </nav>
      <main className="mt-6">{children}</main>
    </div>
  );
};

export default layout;
