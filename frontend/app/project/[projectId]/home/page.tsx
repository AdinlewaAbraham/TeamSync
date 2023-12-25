"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/project/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import { useRouter } from "next/navigation";
import NoResourceComp from "@/components/project/home/resources/NoResourceComp";
import MemberCard from "@/components/project/home/members/projectMembers/MemberCard";
import ProjectMembersComponent from "@/components/project/home/members/projectMembers/ProjectMembersComponent";
import ProjectPrivacyComponent from "@/components/project/home/projectPrivacy/ProjectPrivacyComponent";
import WYSIWYGEditor from "@/components/editor/RichTextEditor";
import { fetchWithAuth } from "@/app/api/fetchWithAuth";
import Project from "@/interfaces/project";
const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject, activeWorkspace } =
    useGlobalContext();
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [contentStateJSON, setContentStateJSON] =
    useState<RawDraftContentState>();
  const [editorState, setEditorState] = useState<EditorState>();

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
  // useEffect(() => {
  //   if (activeProject) setContentStateJSON(contentStateJSONDefault);
  // }, [contentStateJSONDefault, activeProject]);
  console.log("catch infinity loop");

  useEffect(() => {
    if (activeProject) {
      const projectDescriptionString = activeProject.description;
      const projectDescription = projectDescriptionString
        ? JSON.parse(projectDescriptionString)
        : null;
      const contentStateJSON: RawDraftContentState =
        projectDescription ||
        convertToRaw(EditorState.createEmpty().getCurrentContent());
      setContentStateJSON(contentStateJSON);
      contentStateJSON.entityMap = {};
      if (contentStateJSON) {
        console.log(contentStateJSON);
        const contentState = convertFromRaw(contentStateJSON);
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    }
  }, [activeProject]);

  if (!activeProject) return <>loading comp</>;
  if (!editorState) return <>loading comp</>;

  const onBlurWYSIWYGEditorFunction = async (data: RawDraftContentState) => {
    if (JSON.stringify(contentStateJSON) !== JSON.stringify(data)) {
      setContentStateJSON(data);
      const body = {
        projectDescription: JSON.stringify(data),
        projectId: activeProject._id,
      };
      try {
        const response = await fetch("/api/project/updateprojectdescription/", {
          method: "PUT",
          body: JSON.stringify(body),
        });
        if (response.ok) {
          const newProjectObject: Project = {
            ...activeProject,
            description: JSON.stringify(data),
          };
          setActiveProject(newProjectObject);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className="[&>div>div>div>h3]:text-[20px absolute inset-0 flex flex-1 overflow-y-auto [&>div>div>div>h3]:mb-2 [&>div>div>div>h3]:font-medium ">
      <div className="flex flex-1">
        {process.env.API_HOST}
        <div className="flex max-h-full flex-1 justify-center overflow-y-auto p-10">
          <div className=" flex w-full max-w-3xl flex-col [&>div>h3]:mb-2 [&>div>h3]:text-[20px] [&>div>h3]:font-medium [&>div]:mb-8">
            <div className="w-full">
              <h3>Project description</h3>
              <WYSIWYGEditor
                editorState={editorState}
                onBlurFunc={onBlurWYSIWYGEditorFunction}
                turnOffBorders={false}
                alwaysShowButtons={false}
              />
            </div>
            <div className="w-full">
              <h3>Project members</h3>
              <ProjectMembersComponent activeProject={activeProject} />
            </div>
            <div className="w-full">
              <h3 className="">Key resources</h3>
              <div>
                {activeProject?.projectResources?.length === 0 &&
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
            <div className="w-full">
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
