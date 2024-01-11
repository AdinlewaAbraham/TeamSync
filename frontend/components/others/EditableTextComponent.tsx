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
  const inputRef = useRef(null);
  const handleInputBur = () => {
    handleTextSave(editableText.trim());
    setEditableText(editableText.trim());
  };

  useEffect(() => {
    updateInputWidth();
  }, [editableText]);

  const updateInputWidth = () => {
    if (inputRef.current) {
      const textWidth = getTextWidth(editableText);
      (inputRef.current as HTMLElement).style.width = `${
        typeof textWidth === "number" ? textWidth + 2 : textWidth
      }px `;
    }
  };

  const getTextWidth = (text: string) => {
    if (!inputRef.current) return;
    const inputEle = inputRef.current as HTMLElement;

    const styles = window.getComputedStyle(inputEle);

    const tempSpan = document.createElement("span");

    tempSpan.style.position = "absolute";
    tempSpan.style.top = "0";
    tempSpan.style.left = "-9999px";
    tempSpan.style.overflow = "hidden";
    tempSpan.style.visibility = "hidden";
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.style.height = "0";

    tempSpan.style.fontFamily = styles.fontFamily;
    tempSpan.style.fontSize = styles.fontSize;
    tempSpan.style.fontStyle = styles.fontStyle;
    tempSpan.style.fontWeight = styles.fontWeight;
    tempSpan.style.letterSpacing = styles.letterSpacing;
    tempSpan.style.textTransform = styles.textTransform;
    tempSpan.innerHTML = text.replace(/\s/g, "&" + "nbsp;");
    // tempSpan.innerText = text;

    tempSpan.style.borderLeftWidth = styles.borderLeftWidth;
    tempSpan.style.borderRightWidth = styles.borderRightWidth;
    tempSpan.style.paddingLeft = styles.paddingLeft;
    tempSpan.style.paddingRight = styles.paddingRight;

    document.body.appendChild(tempSpan);
    const width = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);
    return width;
  };

  return (
    <div className={`${containerStyles}`}>
      <input
        type="text"
        ref={inputRef}
        className={`border border-transparent bg-inherit p-px focus-visible:outline-none focus-visible:ring-0 ${styles}`}
        value={editableText}
        onChange={(e) => setEditableText(e.target.value)}
        onBlur={handleInputBur}
      />
    </div>
  );
};

export default EditableTextComponent;
