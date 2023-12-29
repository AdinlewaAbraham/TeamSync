import { useGlobalContext } from "@/context/GeneralContext";
import React, { useEffect } from "react";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";

const UserHomePageHeaderComponent = ({
  userId,
  setShowAddWidgetSideBar,
}: {
  userId: string;
  setShowAddWidgetSideBar: (c: boolean) => void;
}) => {
  const { user } = useGlobalContext();
  const currentDate = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const getPartOfDay = () => {
    const currentTime = currentDate.getHours();

    if (currentTime >= 5 && currentTime < 12) {
      return "morning";
    } else if (currentTime >= 12 && currentTime < 18) {
      return "afternoon";
    } else {
      return "evening";
    }
  };
  const Divider = () => {
    return (
      <i className="text-lg">
        <RxDividerVertical />
      </i>
    );
  };
  return (
    <div className="w-full">
      <h1 className="py-8 text-lg font-semibold">Home</h1>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-dark">
            {days[currentDate.getDay()]}, {months[currentDate.getMonth()]}{" "}
            {currentDate.getDate()}
          </p>
          <h2 className="mt-2 text-4xl font-bold">
            Good {getPartOfDay()}, {user?.name}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-sm [&>div]:flex [&>div]:items-center [&>div]:rounded-lg [&>div]:px-2 [&>div]:py-1 [&>div]:text-muted-dark">
          <div className="flex cursor-pointer justify-between transition-all duration-150 hover:bg-menuItem-active hover:text-slate-200">
            <i className="text-lg">
              <CiCalendar />
            </i>
            <span className="mx-1">my week</span>
            <i className="text-2xl">
              <RiArrowDropDownLine />
            </i>
          </div>
          <Divider />
          <div>{9} tasks completed</div>
          <Divider />
          <div className="">{0} collabs</div>
          <button
            className="ml- flex items-center rounded-lg border border-border-default px-3 py-1.5 transition-colors duration-150 hover:bg-menuItem-active"
            onClick={() => setShowAddWidgetSideBar(true)}
          >
            <i className="mr-2">
              <MdOutlineDashboardCustomize />
            </i>
            Customize
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHomePageHeaderComponent;
