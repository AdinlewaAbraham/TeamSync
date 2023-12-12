import React, { useEffect, useState } from "react";
import RichEditorProjectDesc, {
  getBlockStyle,
  styleMap,
} from "./RichTextEditor";
import {
  ContentBlock,
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import "@/components/project/editor/rich.css";
import { useGlobalContext } from "@/context/GeneralContext";

const ProjectDescEditor = () => {
  const [inEditMode, setInEditMode] = useState(false);
  const emptyContentStateJSON = EditorState.createEmpty();
  const { activeProject } = useGlobalContext();
  const [contentStateJSON, setContentStateJSON] =
    useState<RawDraftContentState>(
      (activeProject?.description as RawDraftContentState) ||
        convertToRaw(EditorState.createEmpty().getCurrentContent())
    );

  const contentState = convertFromRaw(contentStateJSON);
  const editorState = EditorState.createWithContent(contentState);

  useEffect(() => {
    const contentStateString = localStorage.getItem("projectDescriptionJson");
    const scopedContentStateJSON = contentStateString
      ? JSON.parse(contentStateString)
      : null;
    if (scopedContentStateJSON) {
      setContentStateJSON(scopedContentStateJSON);
      if (
        JSON.stringify(scopedContentStateJSON) !==
        JSON.stringify(contentStateJSON)
      ) {
        // update data on sever
      }
    }
  }, [inEditMode]);
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest(".RichEditorProjectDesc")) {
        setInEditMode(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="">
      <div>
        {inEditMode ? (
          <div className="RichEditorProjectDesc">
            <RichEditorProjectDesc
              editorState={editorState}
              onBlurFunc={() => console.log("onblur")}
            />
          </div>
        ) : (
          <div className="border border-transparent">
            <div
              className="RichEditorProjectDesc p-3 hover:border-border-default border
            border-transparent cursor-text rounded-lg min-h-[131px] box-content"
              onClick={() => {
                setInEditMode(true);
                console.log("clicked on div");
              }}
            >
              <div
                className="RichEditor-editor mb-[40px] "
                style={{ marginBottom: "38px" }}
              >
                <Editor
                  blockStyleFn={
                    getBlockStyle as (block: ContentBlock) => string
                  }
                  customStyleMap={styleMap}
                  editorState={editorState}
                  // readOnly={true}
                  onFocus={() => setInEditMode(true)}
                  onChange={() => {}}
                  // placeholder="what can i write"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDescEditor;
