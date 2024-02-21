import SubLayoutNavbarLoading from "@/components/loading/navbar/SubLayoutNavbarLoading";
import EditableTextComponent from "@/components/others/EditableTextComponent";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SubLayoutReusableNavbarNavbarItem from "./SubLayoutReusableNavbarNavbarItem";
import { IoMdAdd } from "react-icons/io";
import { FcCalendar } from "react-icons/fc";

const SubLayoutReusableNavbar = ({
  showNavbar,
  navHeader,
  isLoading,
  navbarItemsArray,
  hanldeTextSave,
  headerSideComponent,
}: {
  showNavbar: boolean;
  navHeader: string;
  isLoading: boolean;
  navbarItemsArray: { icon?: ReactNode | null; title: string; href: string }[];
  hanldeTextSave: (text: string) => void;
  headerSideComponent?: ReactNode;
}) => {
  if (isLoading) return <SubLayoutNavbarLoading />;
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
          <div className="ml-4 flex flex-col">
            <div className="flex h-full items-center">
              <div
                className="mr-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[#4573d2] text-3xl"
                children={<FcCalendar />}
              />
              <div>
                <div className="flex">
                  <h1 className="">
                    <EditableTextComponent
                      text={navHeader}
                      handleTextSave={hanldeTextSave}
                      styles="mr-2 font-medium text-xl border"
                      containerStyles="max-w-max p-px"
                      key={navHeader}
                    />
                  </h1>
                  {headerSideComponent}
                </div>
                <ul className="flex items-end gap-1 rounded-lg pr-2">
                  {navbarItemsArray.map((item, index) => (
                    <SubLayoutReusableNavbarNavbarItem
                      key={item.title + index}
                      title={item.title}
                      icon={item.icon}
                      href={item.href}
                    />
                  ))}
                  <li role="button" className="flex items-center text-sm">
                    <i className="flex items-center rounded-lg p-1.5 hover:bg-menuItem-active">
                      <IoMdAdd />
                      {/* View */}
                    </i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default SubLayoutReusableNavbar;
