import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";
import { CiCalendar } from "react-icons/ci";

const UserHomePageHeaderComponent = ({ userId }: { userId: string }) => {
  const { user } = useGlobalContext();
  return (
    <div className="w-full">
      <h1 className="py-8 text-lg font-semibold">Home</h1>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-dark">Sunday, December 17</p>
          <h2 className="mt-2 text-4xl font-bold">
            Good evening, {user?.name}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-sm [&>div>i]:mr-2 [&>div]:flex [&>div]:items-center [&>div]:text-muted-dark">
          <div>
            <i>
              <CiCalendar />
            </i>
            my week
          </div>
          <div>{9} tasks completed</div>
          <div className="">{0} collabs</div>
          <button className="rounded-lg border border-border-default px-3 py-1.5 ">
            Customize
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHomePageHeaderComponent;
