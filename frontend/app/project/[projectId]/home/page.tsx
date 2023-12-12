"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useState } from "react";
import ProjectDescEditor from "@/components/project/editor/ProjectDescEditor";
import {
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
} from "draft-js";
import { useRouter } from "next/navigation";
import NoResourceComp from "@/components/project/resources/NoResourceComp";
const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();
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
  const contentStateJSON: RawDraftContentState = {
    blocks: [
      {
        key: "8i090",
        text: "Hello CodePulse!",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 16,
            style: "BOLD",
          },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: "42ncd",
        text: "This text should be underlined.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 31,
            style: "UNDERLINE",
          },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: "327r6",
        text: "And this text should be italic.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 31,
            style: "ITALIC",
          },
        ],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };
  const contentState = convertFromRaw(contentStateJSON);
  const editorState = EditorState.createWithContent(contentState);

  return (
    <div className="absolute inset-0 overflow-y-auto flex [&>div>div>div>h3]:font-medium [&>div>div>div>h3]:mb-2 [&>div>div>div>h3]:text-[20px flex-1 ">
      <div className="flex-1 flex">
        <div className="p-10 flex flex-col justify-center max-w-3xl h-full overflow-y-auto">
          <div className="">
            <h3>Project description</h3>
            <ProjectDescEditor />
          </div>
          <div className="">
            <h3>Project admins</h3>
          </div>
          <div>
            <h3 className="mb-10">Key resources</h3>
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
        </div>
        <div className="p-10 border-l border-border-default overflow-y-auto">
          <div className="mb-[3000px]">
            <h3 className="text-[20px] font-medium mb-2 ">
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
