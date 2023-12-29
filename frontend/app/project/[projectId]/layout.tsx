"use client";
import EditableComp from "@/components/others/EditableTextComponent";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/project/fetchProject";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { LuClipboardCheck } from "react-icons/lu";
import { PiFlowArrowBold } from "react-icons/pi";
import { BiHomeAlt2 } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import SubLayoutReusableNavbar from "@/components/navbar/SubLayoutReusableNavbar/SubLayoutReusableNavbar";
import Section from "@/interfaces/section";
import Task from "@/interfaces/task";

const layout = ({
  params,
  children,
}: {
  params: { projectId: string };
  children: ReactNode;
}) => {
  const { user, activeWorkspace, activeProject, setActiveProject } =
    useGlobalContext();
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
      setActiveProject(data);
      console.log(data, status);
      if (status === 404 && data.error === "PROJECT_NOT_FOUND") {
        console.log("redirecting");
        router.push("/home"); // or push to disired url
      } else {
        // router.push("/project/" + params.projectId + "/home");
      }
    };
    getProject();
  }, [params.projectId]);
  const navbarBaseUrl = "/project/" + activeProject?._id + "/";
  return (
    <section className="relative flex flex-1 flex-col overflow-x-hidden">
      <SubLayoutReusableNavbar
        isLoading={!activeProject}
        navHeader={activeProject?.projectName || ""}
        navbarItemsArray={[
          {
            href: navbarBaseUrl + "home",
            title: "home",
            icon: <BiHomeAlt2 />,
          },
          {
            href: navbarBaseUrl + "dashboard",
            title: "dashboard",
            icon: <FaChartLine />,
          },
          {
            href: navbarBaseUrl + "tasks/board",
            title: "tasks",
            icon: <LuClipboardCheck />,
          },
          {
            href: navbarBaseUrl + "files",
            title: "files",
            icon: <FaChartLine />,
          },
        ]}
        showNavbar={showNavbar}
      />

      <button
        onClick={() => setShowNavbar(!showNavbar)}
        className="absolute right-5 top-5 z-50"
      >
        toggle nav
      </button>
      {/* <div className="flex justify-center">
        <button onClick={addTask} className="bg-green-400 px-2">
          add task
        </button>
        <button onClick={deleteTask} className="bg-red-400 px-2">
          delete task
        </button>
      </div> */}
      <main className="relative flex h-full flex-1 flex-col">{children}</main>
    </section>
  );
};

export default layout;
