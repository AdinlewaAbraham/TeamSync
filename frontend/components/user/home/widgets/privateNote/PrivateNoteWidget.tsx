import WYSIWYGEditor from "@/components/editor/RichTextEditor";
import { useGlobalContext } from "@/context/GeneralContext";
import {
  EditorState,
  RawDraftContentState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import React, { useEffect, useState } from "react";

const PrivateNoteWidget = () => {
  const { user, setUser } = useGlobalContext();

  const [contentStateJSON, setContentStateJSON] =
    useState<RawDraftContentState>();
  const [editorState, setEditorState] = useState<EditorState>();

  useEffect(() => {
    if (user) {
      const projectDescriptionString = user.privateNote;
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

        console.log(newEditorState);
        setEditorState(newEditorState);
      }
    }
  }, [user]);
  const onBlurWYSIWYGEditorFunction = async (data: RawDraftContentState) => {
    if (JSON.stringify(contentStateJSON) !== JSON.stringify(data) && user) {
      setContentStateJSON(data);
      const body = {
        privateNote: JSON.stringify(data),
        field: "privateNote",
      };
      console.log(body);
      try {
        const response = await fetch("/api/user/", {
          method: "PUT",
          body: JSON.stringify(body),
        });
        console.log(response.status);
        const data = await response.json();
        setUser({ ...user, privateNote: data });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-6 pt-6">
      <header className="">
        <h3 className="text-xl font-medium">Private notepad</h3>
      </header>
      <div className="flex flex-1 overflow-y-auto">
        <WYSIWYGEditor
          editorState={editorState}
          onBlurFunc={onBlurWYSIWYGEditorFunction}
          turnOffBorders={true}
          alwaysShowButtons={true}
          placeholder=""
          mainDivClasses="flex-1 flex overflow-x-hidden"
          editorClasses="overflow-y-auto overflow-x-hidden h-full max-w-full"
          buttonPanelclasses="pt-2"
          key={JSON.stringify(editorState)}
        />
      </div>
    </div>
  );
};

export default PrivateNoteWidget;
