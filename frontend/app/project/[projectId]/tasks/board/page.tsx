"use client";
import BoardCard from "@/components/tasks/board/BoardCard";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/project/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import Project from "@/interfaces/project";
import Section from "@/interfaces/section";
import Board from "@/components/tasks/board/Board";

const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();
  useState<boolean>(false);
  useEffect(() => {
    const fetchProjectFunc = async () => {
      const response = await fetchProject(params.projectId);
      if (!response) {
      } else {
        const { data, status } = response;
        await redirectToLogin(status, data?.error);
        // console.log(data);
        setActiveProject(data);
        localStorage.setItem(params.projectId, JSON.stringify(data));
      }
    };
    const getProject = async () => {
      await fetchProjectFunc();
    };
    const resolveFuncSync = async () => {
      await Promise.all([getProject()]);
    };
    resolveFuncSync();
  }, []);

  if (!activeProject?.sections) return <>loading statee</>;

  return (
    <Board
      paramsProjectId={params.projectId}
    />
  );
};

export default page;
