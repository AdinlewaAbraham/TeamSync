"use client";
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
const NavbarItem = ({
  title,
  activeWorkspaceId,
}: {
  title: string;
  activeWorkspaceId: string;
}) => {
  const pathname = usePathname();
  const lowercaseTitle = title.toLowerCase();
  const isCurrentTab = pathname.endsWith(lowercaseTitle);
  return (
    <Link
      href={"/workspace/" + activeWorkspaceId + "/" + lowercaseTitle}
      key={title}
    >
      <li
        className={` cursor-pointer p-2 text-muted-dark transition-colors duration-150 hover:text-white
      ${isCurrentTab && "border-b-2 text-white"} border-white`}
      >
        {title}
      </li>
    </Link>
  );
};

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
  return (
    <section className="relative flex flex-1 flex-col">
      <AnimatePresence initial={false}>
        {showNavbar && (
          <motion.nav
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
            className="w-full border-b border-border-default overflow-hidden"
          >
            <div className="m-4 mb-0">
              <div className="flex items-center">
                <div className="mr-2 h-10 w-10 rounded-full bg-slate-400" />
                <h1 className="text-xl">{activeWorkspace?.name}</h1>
              </div>
              <ul
                className="mt-2 flex rounded-lg
        "
              >
                {["Home", "Calendar", "Dashboard"].map((item) => (
                  <div key={item}>
                    <NavbarItem
                      title={item}
                      activeWorkspaceId={params.workspaceId}
                    />
                  </div>
                ))}
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <button
        onClick={() => setShowNavbar(!showNavbar)}
        className="absolute right-5 top-5 z-50"
      >
        toggle nav
      </button>
      <main className="flex h-full flex-1 relative">{children}</main>
    </section>
  );
};

export default layout;
