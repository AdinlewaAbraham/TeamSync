import React, { useEffect, useRef, useState } from "react";

const EditableTextComponent = ({
  text,
  styles,
}: {
  text: string;
  styles: string;
}) => {
  const [editableText, setEditableText] = useState<string>(text);
  const [editableMode, setEditableMode] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const inputRef = useRef(null);
  const handleTextClick = () => {
    setEditableMode(true);
    setInputText(text);
  };
  useEffect(() => {
    
  }, [])
  
  return (
    <div className="file:border ">
      {editableMode ? (
        <input
          type="text"
          ref={inputRef}
          className={`max-w-max border border-transparent bg-inherit focus-visible:outline-none focus-visible:ring-0 ${styles}`}
          value={inputText}
          autoFocus
          onChange={(e) => console.log(e)}
          onBlur={() => setEditableMode(false)}
        />
      ) : (
        <div
          onClick={handleTextClick}
          className={`border border-transparent  hover:border-gray-500 ${styles}`}
        >
          {editableText}
        </div>
      )}
    </div>
  );
};

export default EditableTextComponent;
