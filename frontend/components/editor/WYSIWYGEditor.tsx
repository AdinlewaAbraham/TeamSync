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
import "./rich.css";
import { useGlobalContext } from "@/context/GeneralContext";

const WYSIWYGEditor = () => {
  const [inEditMode, setInEditMode] = useState(false);
  const emptyContentStateJSON = EditorState.createEmpty();
  const { activeProject } = useGlobalContext();

  const contentStateJSONDefault = false
    ? activeProject?.description
    : convertToRaw(EditorState.createEmpty().getCurrentContent());
  const [contentStateJSON, setContentStateJSON] =
    useState<RawDraftContentState>(
      contentStateJSONDefault as RawDraftContentState,
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
      <div className="RichEditorProjectDesc">
        <RichEditorProjectDesc
          editorState={editorState}
          onBlurFunc={() => console.log("onblur")}
          turnOffBorders={false}
          alwaysShowButtons={false}
        />
      </div>
    </div>
  );
};

export default WYSIWYGEditor;
