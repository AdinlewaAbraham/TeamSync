"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect } from "react";
import ProjectDescEditor from "@/components/project/editor/ProjectDescEditor";
import {
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
} from "draft-js";
const page = ({ params }: { params: { projectId: string } }) => {
  const { activeProject, setActiveProject } = useGlobalContext();

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
      <div className="flex-1">
        <div className="p-10">
          <div className="">
            <h3>Project description</h3>
            <ProjectDescEditor />
          </div>
          <div>
            <h3 className="mb-10">Key resources</h3>
            <div>
              {activeProject.projectResources.length === 0 ? (
                <div className="flex h-[160px] p-2 border border-border-default rounded-lg items-center justify-center">
                  <div></div>
                  <div>
                    <p className="text-sm">
                      Align your team around a shared vision with a project
                      brief and supporting resources.
                    </p>
                    <div>
                      <div>create project brief</div> <div>Add link</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
        <div className="p-10">
          <div>
            <h3 className="text-[20px] font-medium mb-2">
              What is the status?
            </h3>{" "}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
