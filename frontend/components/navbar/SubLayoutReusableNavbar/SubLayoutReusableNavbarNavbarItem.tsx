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
    <Link href={href.toLowerCase()} key={title}>
      <li
        className={` flex cursor-pointer items-center p-2 text-sm text-muted-dark transition-colors duration-150 hover:text-white
        ${
          isCurrentTab ? "navbarBorderB text-white" : "navbarBorderBHover"
        } border-white`}
      >
        {icon && <i className="mr-1">{icon}</i>}
        {title.charAt(0).toUpperCase() + title.substring(1)}
      </li>
    </Link>
  );
};

export default SubLayoutReusableNavbarNavbarItem;
