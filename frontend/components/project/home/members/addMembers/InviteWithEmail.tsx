import React from "react";

const InviteWithEmail = () => {
  return (
    <div className="border-b border-border-default p-6">
      <h2 className="pb-4 font-medium text-base">Invite with email</h2>
      <div className="flex">
        <input type="text" className="text-input mr-2 flex-1" />
        <button className="button-default bg-accent-primary text-black">Invite</button>
      </div>
    </div>
  );
};

export default InviteWithEmail;
