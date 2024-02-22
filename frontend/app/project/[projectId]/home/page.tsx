"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import React, { useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import NoResourceComp from "@/components/project/home/resources/NoResourceComp";
import ProjectMembersComponent from "@/components/project/home/members/projectMembers/ProjectMembersComponent";
import ProjectPrivacyComponent from "@/components/project/home/projectPrivacy/ProjectPrivacyComponent";
import WYSIWYGEditor from "@/components/editor/RichTextEditor";
import { fetchWithAuth } from "@/app/api/fetchWithAuth";
import Project from "@/interfaces/project";
const Page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject, activeWorkspace } =
    useGlobalContext();

  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [contentStateJSON, setContentStateJSON] =
    useState<RawDraftContentState>();
  const [editorState, setEditorState] = useState<EditorState>();

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
  if (!editorState) return <>loading editor</>;

  const onBlurWYSIWYGEditorFunction = async (data: RawDraftContentState) => {
    if (JSON.stringify(contentStateJSON) !== JSON.stringify(data)) {
      setContentStateJSON(data);
      const body = {
        description: JSON.stringify(data),
      };
      try {
        const response = await fetch("/api/project/" + activeProject._id, {
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
    <div className="absolute inset-0 flex flex-1 overflow-y-auto [&>div>div>div>h3]:mb-2 [&>div>div>div>h3]:text-[20px] [&>div>div>div>h3]:font-medium ">
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
                mainDivClasses="min-h-[131px]"
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

export default Page;
