import React, { useState } from "react";

const AddLinkModal = () => {
  const [linkInfo, setLinkInfo] = useState({ name: "", URL: "" });
  const [inValidURL, setInValidURL] = useState(false);
  const handleLinkAdd = () => {
    if (!linkInfo.URL) {
      setInValidURL(true);
      return;
    }
  };
  return (
    <div
      className="addLinkModal w-[480px] border border-border-default bg-bg-secondary rounded-lg p-4 grid 
    grid-flow-row gap-4 [&>div]:flex [&>div]:flex-col 
    [&>div>input]:text-input [&>div>label]:font-semibold [&>div>label]:mb-2 [&>div>label]:text-xs [&>div>label]:text-muted-dark"
    >
      <div>
        <label htmlFor="">Resource name</label>
        <input
          type="text "
          className=""
          onChange={(e) => {
            setLinkInfo({ ...linkInfo, name: e.target.value });
            setInValidURL(false);
          }}
        />
      </div>
      <div>
        <label htmlFor="">Add a link to a project resource</label>
        <input
          type="text"
          className={`${inValidURL && "border border-red-400"}`}
          style={{ border: inValidURL ? "1px solid #f86c53" : "" }}
          placeholder="Paste URL"
          onChange={(e) => {
            setLinkInfo({ ...linkInfo, URL: e.target.value });
            setInValidURL(false);
          }}
        />
        {inValidURL && (
          <span className="text-xs font-light text-red-400 mt-2">
            Please enter a valid URL
          </span>
        )}
      </div>
      <button
        className={`flex justify-start button-default ${
          linkInfo.URL
            ? "bg-accent-primary text-black"
            : "bg-transparent border border-border-default text-muted-dark"
        } max-w-max  text-sm`}
        onClick={handleLinkAdd}
      >
        Add link
      </button>
    </div>
  );
};

export default AddLinkModal;
