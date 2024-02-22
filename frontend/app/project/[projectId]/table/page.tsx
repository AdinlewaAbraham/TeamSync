"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import { usePopper } from "react-popper";
import fetchProject from "@/helpers/project/fetchProject";
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

const Page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();

  return <Table paramsProjectId={params.projectId} project={activeProject} />;
};

export default Page;
