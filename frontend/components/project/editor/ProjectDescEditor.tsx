import React, { useEffect, useState } from "react";
import RichEditorProjectDesc from "./RichTextEditor";
import {
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
} from "draft-js";

const ProjectDescEditor = () => {
  const [inEditMode, setInEditMode] = useState(false);
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
            <RichEditorProjectDesc />
          </div>
        ) : (
          <div
            className="RichEditorProjectDesc p-2 pt-[5px] hover:border-border-default border border-transparent cursor-text rounded-lg min-h-[131px]"
            onClick={() => {
              console.log("clicked on div");
              setInEditMode(true);
            }}
          >
            <div className="mb-[15px] + thesizeofstylesnavgator">
              <Editor
                editorState={editorState}
                readOnly={true}
                onChange={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDescEditor;
