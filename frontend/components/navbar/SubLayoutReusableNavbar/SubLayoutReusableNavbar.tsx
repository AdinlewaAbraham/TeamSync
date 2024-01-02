import SubLayoutNavbarLoading from "@/components/loading/navbar/SubLayoutNavbarLoading";
import EditableComp from "@/components/others/EditableTextComponent";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SubLayoutReusableNavbarNavbarItem from "./SubLayoutReusableNavbarNavbarItem";

const SubLayoutReusableNavbar = ({
  showNavbar,
  navHeader,
  isLoading,
  navbarItemsArray,
}: {
  showNavbar: boolean;
  navHeader: string;
  isLoading: boolean;
  navbarItemsArray: { icon?: ReactNode | null; title: string; href: string }[];
}) => {
  return (
    <AnimatePresence initial={false}>
      {showNavbar && (
        <motion.nav
          style={{ willChange: "height, opacity" }}
          initial={{
            height: 0,
            opacity: 0,
          }}
          animate={
            showNavbar && {
              height: "auto",
              opacity: 1,
            }
          }
          exit={{
            height: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="p- w-full flex-shrink-0 overflow-hidden border-b border-border-default pb-0"
        >
          {isLoading ? (
            <SubLayoutNavbarLoading />
          ) : (
            <div className="">
              <div className="ml-4 mt-4 flex items-center">
                <div className="mr-2 h-10 w-10 rounded-lg bg-slate-400" />
                <h1 className="">
                  <EditableComp
                    text={navHeader}
                    styles="mx-2 font-medium text-xl"
                  />
                </h1>
              </div>

              <ul className="ml-4 flex rounded-lg p-2 pb-0 pl-0">
                {navbarItemsArray.map((item, index) => (
                  <SubLayoutReusableNavbarNavbarItem
                    key={item.title + index}
                    title={item.title}
                    icon={item.icon}
                    href={item.href}
                  />
                ))}
              </ul>
            </div>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default SubLayoutReusableNavbar;
