"use client";
import BoardCard from "@/components/tasks/board/BoardCard";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/project/fetchProject";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import Project from "@/interfaces/project";
import Section from "@/interfaces/section";
import Board from "@/components/tasks/board/Board";

const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject } = useGlobalContext();

  return <Board paramsProjectId={params.projectId} project={activeProject} />;
};

export default page;
