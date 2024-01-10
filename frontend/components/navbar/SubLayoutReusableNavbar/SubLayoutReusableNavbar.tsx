import SubLayoutNavbarLoading from "@/components/loading/navbar/SubLayoutNavbarLoading";
import EditableTextComponent from "@/components/others/EditableTextComponent";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SubLayoutReusableNavbarNavbarItem from "./SubLayoutReusableNavbarNavbarItem";
import { IoMdAdd } from "react-icons/io";

const SubLayoutReusableNavbar = ({
  showNavbar,
  navHeader,
  isLoading,
  navbarItemsArray,
  hanldeTextSave,
}: {
  showNavbar: boolean;
  navHeader: string;
  isLoading: boolean;
  navbarItemsArray: { icon?: ReactNode | null; title: string; href: string }[];
  hanldeTextSave: (text: string) => void;
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
                <div className="flex h-full items-start">
                  <div className="mr-2 h-10 w-10 rounded-lg bg-slate-400" />
                </div>
                <div>
                  <h1 className="">
                    <EditableTextComponent
                      text={navHeader}
                      handleTextSave={hanldeTextSave}
                      styles="mx-2 font-medium text-xl max-w-max"
                      key={navHeader}
                    />
                  </h1>

                  <ul className="flex gap-1 rounded-lg pr-2">
                    {navbarItemsArray.map((item, index) => (
                      <SubLayoutReusableNavbarNavbarItem
                        key={item.title + index}
                        title={item.title}
                        icon={item.icon}
                        href={item.href}
                      />
                    ))}
                    <li role="button" className="flex items-center">
                      <i className="rounded-lg p-2 hover:bg-menuItem-active">
                        <IoMdAdd />
                      </i>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default SubLayoutReusableNavbar;
