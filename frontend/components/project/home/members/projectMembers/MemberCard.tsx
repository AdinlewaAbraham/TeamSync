import User from "@/interfaces/user";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";

const MemberCard = ({ member }: { member: { user: User; role: string } }) => {
  return (
    <div className="group flex cursor-pointer rounded-lg p-2 transition-colors duration-150 hover:bg-menuItem-active ">
      <img
        src={member.user?.userDisplayImage}
        width={36}
        height={36}
        className="mr-2 rounded-full"
        alt="user image"
      />
      <div className="relative mr-px flex-1">
        <div
          className="absolute h-full w-full truncate whitespace-nowrap text-sm [&>span]:block 
        [&>span]:overflow-hidden [&>span]:overflow-ellipsis"
        >
          <span>{member.user?.userName}aaaaaaaaaaaaaaa</span>
          <span className="text-xs text-muted-dark">{member.user?.email}</span>
        </div>
      </div>
      <div className=" hidden items-center justify-end text-sm text-muted-dark group-hover:flex">
        <IoIosArrowDown />
      </div>
    </div>
  );
};

export default MemberCard;
