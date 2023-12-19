"use client";
import EditableComp from "@/components/others/EditableComp";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { LuClipboardCheck } from "react-icons/lu";
import { PiFlowArrowBold } from "react-icons/pi";
import { BiHomeAlt2 } from "react-icons/bi";
import {} from "react-icons/";
import {} from "react-icons/";
import {} from "react-icons/";
import {} from "react-icons/";
import { AnimatePresence, motion } from "framer-motion";

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
        className={` flex cursor-pointer items-center p-2 text-sm text-muted-dark transition-colors duration-150 hover:text-white
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
  const [showNavbar, setShowNavbar] = useState(true);
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
    <section className="relative flex flex-1 flex-col overflow-x-hidden">
      <AnimatePresence initial={false}>
        {showNavbar && (
          <motion.nav
            style={{ willChange: "height, opacity" }}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p- w-full flex-shrink-0 overflow-hidden border-b border-border-default pb-0"
          >
            {activeProject && (
              <div className="ml-4 mt-4 flex items-center">
                <div className="mr-2 h-10 w-10 rounded-full bg-slate-400" />
                <h1 className="text-xl">
                  <EditableComp
                    text={activeProject.projectName}
                    styles="mx-2 my-1"
                  />
                </h1>
              </div>
            )}

            {activeProject && (
              <ul className="ml-4 flex rounded-lg p-2 pb-0 pl-0">
                {[
                  { title: "Home", icon: <BiHomeAlt2 /> },
                  { title: "Dashboard", icon: <FaChartLine /> },
                  { title: "Tasks", icon: <LuClipboardCheck /> },
                  { title: "Files", icon: <FaChartLine /> },
                ].map((item, index) => (
                  <NavbarItem
                    key={item.title + index}
                    title={item.title}
                    projectId={params.projectId}
                    icon={item.icon}
                  />
                ))}
              </ul>
            )}

            {!activeProject && (
              <div className="flex">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item}>loading</div>
                ))}
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>

      <button
        onClick={() => setShowNavbar(!showNavbar)}
        className="absolute right-5 top-5 z-50"
      >
        toggle nav
      </button>
      <main className="relative flex h-full flex-1 flex-col">{children}</main>
    </section>
  );
};

export default layout;
