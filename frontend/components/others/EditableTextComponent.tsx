import React, { useEffect, useRef, useState } from "react";

const EditableTextComponent = ({
  text,
  styles,
  containerStyles,
  handleTextSave,
}: {
  text: string;
  styles: string;
  containerStyles?: string;
  handleTextSave: (text: string) => void;
}) => {
  const [editableText, setEditableText] = useState<string>(text);
  const [editableMode, setEditableMode] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const inputRef = useRef(null);
  const handleTextClick = () => {
    setEditableMode(true);
    setInputText(text);
  };
  useEffect(() => {}, []);
  const handleInputBur = () => {
    setEditableMode(false);
    handleTextSave(inputText);
  };

  return (
    <div className={`${containerStyles}`}>
      {editableMode ? (
        <input
          type="text"
          ref={inputRef}
          className={`border border-transparent bg-inherit p-px focus-visible:outline-none focus-visible:ring-0 ${styles}`}
          value={inputText}
          autoFocus
          onChange={(e) => setInputText(e.target.value)}
          onBlur={handleInputBur}
        />
      ) : (
        <div
          onClick={handleTextClick}
          className={`border border-transparent p-px  hover:border-gray-500 ${styles}`}
        >
          {editableText}
        </div>
      )}
    </div>
  );
};

export default EditableTextComponent;
