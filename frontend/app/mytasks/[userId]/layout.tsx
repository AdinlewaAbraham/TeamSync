"use client";
import SubLayoutReusableNavbar from "@/components/navbar/SubLayoutReusableNavbar/SubLayoutReusableNavbar";
import { useGlobalContext } from "@/context/GeneralContext";
import useTrackProject from "@/hooks/UseTrackProject";
import React, { ReactNode, useEffect, useState } from "react";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaChartLine, FaRegCalendar, FaRegListAlt } from "react-icons/fa";

const layout = ({
  params,
  children,
}: {
  params: { userId: string };
  children: ReactNode;
}) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const { user } = useGlobalContext();
  const navbarBaseUrl = "/mytasks/" + user?._id + "/";
  const { userProject, setUserProject } = useGlobalContext();
  useTrackProject(params.userId, userProject, setUserProject);
  return (
    <div className="relative flex flex-1 flex-col">
      <SubLayoutReusableNavbar
        isLoading={!user?._id}
        navHeader="My tasks"
        navbarItemsArray={[
          {
            href: navbarBaseUrl + "board",
            title: "board",
            icon: <BiSolidBarChartAlt2 />,
          },
          {
            href: navbarBaseUrl + "table",
            title: "table",
            icon: <FaRegListAlt />,
          },
          {
            href: navbarBaseUrl + "calendar",
            title: "calendar",
            icon: <FaRegCalendar />,
          },
          {
            href: navbarBaseUrl + "timeline",
            title: "timeline",
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
      <main className="relative mt-4 flex-1 overflow-auto">
        <div className="absolute inset-0 flex"> {children}</div>
      </main>
    </div>
  );
};

export default layout;
