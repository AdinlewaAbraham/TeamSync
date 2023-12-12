import User from "@/interfaces/user";
import React from "react";

const MemberCard = ({ member }: { member: User }) => {
  return (
    <div className="flex max-h-max">
      <img
        src={member.userDisplayImage}
        width={36}
        height={36}
        className="rounded-full mr-2"
        alt="user image"
      />
      <div>
        <div className="w-full">
          <p className="truncate">{member.name}</p>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default MemberCard;
