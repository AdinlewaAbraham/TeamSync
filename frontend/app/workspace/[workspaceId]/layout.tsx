"use client";
import SubLayoutReusableNavbar from "@/components/navbar/SubLayoutReusableNavbar/SubLayoutReusableNavbar";
import { useGlobalContext } from "@/context/GeneralContext";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  redirect,
  usePathname,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";

const layout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceId: string };
}) => {
  const { user, activeWorkspace } = useGlobalContext();
  const router = useRouter();
  useEffect(() => {
    const checkWorkspaceValidity = () => {
      const arrOfIds = user?.workspaces.map((workspace) => workspace._id);
      if (!arrOfIds?.includes(params.workspaceId)) {
        let redirectToWorkspaceHome;
        if (user?.activeWorkspaceId) {
          redirectToWorkspaceHome = `/workspace/${user?.activeWorkspaceId}/home`;
        } else {
          redirectToWorkspaceHome = `/home`;
        }
        router.push(redirectToWorkspaceHome);
      }
    };

    checkWorkspaceValidity();
  }, [user, params.workspaceId]);
  const [showNavbar, setShowNavbar] = useState(true);
  const navbarBaseUrl = "/workspace/" + activeWorkspace?._id + "/";
  return (
    <section className="relative flex flex-1 flex-col">
      <SubLayoutReusableNavbar
        isLoading={!activeWorkspace}
        navHeader={activeWorkspace?.name || ""}
        navbarItemsArray={[
          {
            href: navbarBaseUrl + "home",
            title: "home",
          },
          {
            href: navbarBaseUrl + "calendar",
            title: "calendar",
          },
          {
            href: navbarBaseUrl + "dashboard",
            title: "dashboard",
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
      <main className="relative flex h-full flex-1">{children}</main>
    </section>
  );
};

export default layout;
