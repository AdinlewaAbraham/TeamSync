"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import { usePopper } from "react-popper";
import fetchProject from "@/helpers/project/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { ReactNode, useEffect, useState } from "react";
import Project from "@/interfaces/project";
import Section from "@/interfaces/section";
import { IoMdArrowDropdown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import RenderStatus, {
  RenderPriority,
} from "@/components/tasks/ConditionalRender";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import { FiLoader } from "react-icons/fi";
import { RiTimerLine } from "react-icons/ri";
import { BiCircle } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import {
  HiOutlineArrowSmDown,
  HiOutlineArrowSmRight,
  HiOutlineArrowSmUp,
} from "react-icons/hi";
import Task from "@/interfaces/task";
import Table from "@/components/tasks/table/Table";


const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();
  // useEffect(() => {
  //   const fetchProjectFunc = async () => {
  //     const response = await fetchProject(params.projectId);
  //     if (!response) {
  //     } else {
  //       const { data, status } = response;
  //       await redirectToLogin(status, data?.error);
  //       setActiveProject(data);
  //       localStorage.setItem(params.projectId, JSON.stringify(data));
  //     }
  //   };
  //   const getProject = async () => {
  //     if (activeProject) return;
  //     const stringData = localStorage.getItem(params.projectId);
  //     const project: Project = stringData ? JSON.parse(stringData) : undefined;

  //     if (project?._id) {
  //       setActiveProject(project);
  //     } else {
  //       await fetchProjectFunc();
  //     }
  //   };
  //   const syncProject = async () => {
  //     if (activeProject?._id) {
  //       await fetchProjectFunc();
  //     }
  //   };
  //   const resolveFuncSync = async () => {
  //     await Promise.all([getProject(), syncProject()]);
  //   };
  //   resolveFuncSync();
  // }, []);

  if (!activeProject?.sections)
    return (
      <div className="flex flex-1 items-center justify-center">
        loading state
      </div>
    );
  return (
    <Table
      paramsProjectId={params.projectId}
      project={activeProject}
      setProject={setActiveProject}
    />
  );
};

export default page;
