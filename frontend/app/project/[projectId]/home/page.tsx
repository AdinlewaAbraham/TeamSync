"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useState } from "react";
import ProjectDescEditor from "@/components/editor/WYSIWYGEditor";
import {
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
} from "draft-js";
import { useRouter } from "next/navigation";
import NoResourceComp from "@/components/project/home/resources/NoResourceComp";
import MemberCard from "@/components/project/home/members/projectMembers/MemberCard";
import ProjectMembersComponent from "@/components/project/home/members/projectMembers/ProjectMembersComponent";
import ProjectPrivacyComponent from "@/components/project/home/projectPrivacy/ProjectPrivacyComponent";
const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject, activeWorkspace } =
    useGlobalContext();
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  useEffect(() => {
    const stringData = localStorage.getItem(params.projectId);
    const project = stringData ? JSON.parse(stringData) : undefined;
    if (project) setActiveProject(project);
    const syncProject = async () => {
      const response = await fetchProject(params.projectId);
      if (!response) return;
      const { data, status } = response;
      await redirectToLogin(status, data.error);
      setActiveProject(data);
      localStorage.setItem(params.projectId, JSON.stringify(data));
    };
    syncProject();
  }, []);
  if (!activeProject) return <>loading comp</>;
  return (
    <div className="[&>div>div>div>h3]:text-[20px absolute inset-0 flex flex-1 overflow-y-auto [&>div>div>div>h3]:mb-2 [&>div>div>div>h3]:font-medium ">
      <div className="flex flex-1">
        <div className="flex max-h-full flex-1 justify-center overflow-y-auto p-10">
          <div className=" flex max-w-3xl flex-col [&>div>h3]:mb-2 [&>div>h3]:text-[20px] [&>div>h3]:font-medium [&>div]:mb-8">
            <div className="">
              <h3>Project description</h3>
              <ProjectDescEditor />
            </div>
            <div className="">
              <h3>Project members</h3>
              <ProjectMembersComponent activeProject={activeProject} />
            </div>
            <div className="">
              <h3 className="">Key resources</h3>
              <div>
                {activeProject.projectResources.length === 0 &&
                !activeProject?.projectBrief ? (
                  <NoResourceComp
                    activeProject={activeProject}
                    showAddLinkModal={showAddLinkModal}
                    setShowAddLinkModal={setShowAddLinkModal}
                  />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            <div>
              <h3>project privacy</h3>
              <ProjectPrivacyComponent />
            </div>
          </div>
        </div>
        <div className="overflow-y-auto border border-l border-border-default p-10">
          <div className="">
            <h3 className="mb-2 text-[20px] font-medium ">
              What is the status?
            </h3>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
