"use client";
import EditableComp from "@/components/EditableComp";
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
        className={` flex items-center p-2 text-sm text-muted-dark hover:text-white transition-colors duration-150 cursor-pointer
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
    <section className="flex-1 flex flex-col relative overflow-x-hidden">
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            style={{ willChange: "height, opacity" }}
            initial={{
              height: 0,
              opacity: 0,
              // padding: "0px",
              // paddingBottom: "0px",
            }}
            animate={{
              height: "auto",
              opacity: 1,
              // paddingTop: "16px",
              // paddingLeft: "16px",
              // paddingRight: "16px",
              // paddingBottom: "0px",
            }}
            exit={{
              height: 0,
              opacity: 0,
              // padding: "0px",
              // paddingBottom: "0px",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full p- pb-0 border-b border-border-default flex-shrink-0 overflow-hidden"
          >
            {activeProject && (
              <div className="flex items-center ml-4 mt-4">
                <div className="h-10 w-10 bg-slate-400 rounded-full mr-2" />
                <h1 className="text-xl">
                  <EditableComp
                    text={activeProject.projectName}
                    styles="mx-2 my-1"
                  />
                </h1>
              </div>
            )}

            {activeProject && (
              <ul className="flex rounded-lg ml-4 p-2 pl-0 pb-0">
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

      <main className="flex-1 relative">{children}</main>
    </section>
  );
};

export default layout;
