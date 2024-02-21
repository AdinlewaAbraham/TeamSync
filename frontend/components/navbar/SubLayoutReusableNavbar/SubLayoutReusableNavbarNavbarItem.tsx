import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const SubLayoutReusableNavbarNavbarItem = ({
  title,
  icon,
  href,
}: {
  title: string;
  icon: ReactNode;
  href: string;
}) => {
  const pathname = usePathname();
  const lowercaseTitle = title.toLowerCase();
  const pathNameFragment = pathname.split("/");
  const isCurrentTab =
    pathname.endsWith(lowercaseTitle) ||
    (lowercaseTitle === "tasks" &&
      pathNameFragment[pathNameFragment.length - 2] === "tasks");
  return (
    <li className="px-1">
      <Link
        href={href.toLowerCase()}
        key={title}
        className={` flex cursor-pointer items-center px-1 pb-1 text-sm font-medium text-muted-dark transition-colors duration-150 hover:text-white
        ${
          isCurrentTab ? "navbarBorderB text-white" : "navbarBorderBHover"
        } border-white`}
      >
        {icon && <i className="mr-1">{icon}</i>}
        {title.charAt(0).toUpperCase() + title.substring(1)}
      </Link>
    </li>
  );
};

export default SubLayoutReusableNavbarNavbarItem;
