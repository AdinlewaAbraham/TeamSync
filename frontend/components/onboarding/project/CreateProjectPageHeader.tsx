import React from "react";
import { MdClose, MdKeyboardBackspace } from "react-icons/md";

const CreateProjectPageHeader = () => {
  return (
    <div
      className="[&>i]: [&>i]: flex h-16 items-center justify-between px-6
    [&>i]:cursor-pointer [&>i]:rounded-lg [&>i]:p-3 [&>i]:text-lg [&>i]:text-muted-dark [&>i]:transition-all [&>i]:duration-150 hover:[&>i]:bg-menuItem-active hover:[&>i]:text-white"
    >
      <i role="button">
        <MdKeyboardBackspace />
      </i>
      <i role="button">
        <MdClose />
      </i>
    </div>
  );
};

export default CreateProjectPageHeader;
