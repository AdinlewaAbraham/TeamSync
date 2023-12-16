import UserImgComponent from "@/components/UserImgComponent";
import { useGlobalContext } from "@/context/GeneralContext";
import { Member } from "@/interfaces/project";
import User from "@/interfaces/user";
import React, { useState } from "react";
import { MemberRoleSwitch } from "./MemberRoleSwitch";


const MemberCard = ({ member }: { member: Member }) => {
  return (
    <div className="flex items-center px-6 py-2 hover:bg-menuItem-active">
      <UserImgComponent
        height={32}
        width={32}
        src={
          typeof member.user === "object"
            ? member.user.userDisplayImage
            : "null"
        }
        alt="user img"
        styles="mr-2 rounded-full"
      />
      <div className="flex flex-1 flex-col ">
        <span>
          {typeof member.user === "object"
            ? member.user.userName
            : "loading..."}
        </span>
        <span className="text-xs text-muted-dark">
          {typeof member.user === "object" ? member.user.email : "loading..."}
        </span>
      </div>
      <MemberRoleSwitch
        role={member.role}
        memberId={typeof member.user === "object" ? member.user._id : "null"}
      />
    </div>
  );
};

export default MemberCard;
