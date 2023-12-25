"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/project/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useRef, useState } from "react";
import Project from "@/interfaces/project";
import generateDates from "@/utilis/generateDates";
import TimelineVerticalBars from "@/components/tasks/timeline/TimelineVerticalBars";
import HourHorizontalColums from "@/components/tasks/timeline/HorizontalRowsForTaskMapping";
import EditableComp from "@/components/others/EditableComp";
import generateDatesForFourMonths from "@/utilis/generateDatesForFourMonths";
import SectionHorizontalRow from "@/components/tasks/timeline/SectionHorizontalRow";
import Section from "@/interfaces/section";
import TimelineSideBarItem from "@/components/tasks/timeline/TimelineSideBarItem";
import TimelineMonthComponent from "@/components/tasks/timeline/TimelineMonthComponent";
import Timeline from "@/components/tasks/timeline/Timeline";

export interface TimelineSectionObj {
  [key: string]: {
    showComponent: boolean;
    componentHeight: number;
  };
}

const page = ({ params }: { params: { projectId: string } }) => {
  return <Timeline paramProjectId={params.projectId} />;
};

export default page;
