import React, { useEffect, useRef, useState } from "react";

const EditableComp = ({ text, styles }: { text: string; styles: string }) => {
  const [editableText, setEditableText] = useState<string>(text);
  const [editableMode, setEditableMode] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const inputRef = useRef(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".editComp")) {
        // setEditableMode(false);
        setEditableMode(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);
  const handleTextClick = () => {
    setEditableMode(true);
    // console.log(inputRef.current);
    setInputText(text);
  };
  return (
    <div className="editComp file:border ">
      {editableMode ? (
        <input
          type="text"
          ref={inputRef}
          className={`editComp bg-red-400 outline-2 max-w-max ${styles}`}
          value={inputText}
          //   autoFocus
          onChange={(e) => console.log(e)}
        />
      ) : (
        <div
          onClick={handleTextClick}
          className={`editComp hover:border-gray-500 border-transparent  border ${styles}`}
        >
          {editableText}
        </div>
      )}
    </div>
  );
};

export default EditableComp;
