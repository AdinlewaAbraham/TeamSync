"use client";
import CreateProjectPageHeader from "@/components/onboarding/project/CreateProjectPageHeader";
import CreateprojectFormSidebar from "@/components/onboarding/project/CreateprojectFormSidebar";
import ProjectVisualizerComponent from "@/components/onboarding/project/ProjectVisualizerComponent";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

export type ProjectViewType = "board" | "calendar" | "timeline" | "table";

const page = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDefaultView, setProjectDefaultView] =
    useState<ProjectViewType>("board");

  return (
    <AnimatePresence>
      <motion.div
        // initial={{ y: 20, opacity: 0 }}
        // animate={{ y: 0, opacity: 1 }}
        // exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="flex flex-1 flex-col bg-bg-secondary"
      >
        <CreateProjectPageHeader />
        <div className="flex justify-start overflow-x-hidden">
          <div className="mb-16 flex flex-1 justify-center">
            <CreateprojectFormSidebar
              projectName={projectName}
              setProjectName={setProjectName}
              projectDefaultView={projectDefaultView}
              setProjectDefaultView={setProjectDefaultView}
            />
            <ProjectVisualizerComponent
              projectName={projectName}
              projectDefaultView={projectDefaultView}
              setProjectDefaultView={setProjectDefaultView}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default page;
