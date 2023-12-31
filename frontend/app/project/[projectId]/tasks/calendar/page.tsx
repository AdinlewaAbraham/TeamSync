"use client";
import CalendarBox from "@/components/tasks/calendar/CalendarBox";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/project/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useRef, useState } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Project from "@/interfaces/project";
import generateDates from "@/utilis/generateDates";
import generateDatesForFourMonths from "@/utilis/generateDatesMonths";
import TaskHoverStatusObj from "@/interfaces/taskHoverStatusObj";
import findMinFreeRowNumber from "@/utilis/findMinFreeRowNumber";
import Task from "@/interfaces/task";
import CalendarRow from "@/components/tasks/calendar/CalendarRow";
import Calendar from "@/components/tasks/calendar/Calendar";

const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();

  useEffect(() => {
    const fetchProjectFunc = async () => {
      const response = await fetchProject(params.projectId);
      if (response) {
        const { data, status } = response;
        setActiveProject(data);
      }
    };
    const getProject = async () => {
      if (!activeProject) {
        await fetchProjectFunc();
      }
    };
    getProject();
  }, []);

  useEffect(() => {
    // localStorage.removeItem("localTaskPositionObject");
  }, []);

  return (
    <Calendar
      paramsProjectId={params.projectId}
      project={activeProject}
      setProject={setActiveProject}
      isLoading={!activeProject}
    />
  );
};

export default page;
