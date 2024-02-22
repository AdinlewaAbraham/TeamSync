import React, { useState, ReactNode } from "react";
import CompletedTasksComponent from "./completed/CompletedTasksComponent";
import OverdueTasksComponent from "./overdue/OverdueTasksComponent";
import UpcomingTasksComponent from "./upcoming/UpcomingTasksComponent";

const ProfilePic = () => {
  return <div className="mr-4 mt-4 h-12 w-12 rounded-full border"></div>;
};
type ActiveComponentType = "Upcoming" | "Overdue" | "Completed";
const MyTasksWidget = () => {
  const [activeComponent, setactiveComponent] =
    useState<ActiveComponentType>("Upcoming");
  const componentTypes: ActiveComponentType[] = [
    "Upcoming",
    "Overdue",
    "Completed",
  ];
  const renderActiveComponent = (): ReactNode => {
    switch (activeComponent) {
      case "Completed":
        return <CompletedTasksComponent />;
        break;
      case "Overdue":
        return <OverdueTasksComponent />;
        break;
      case "Upcoming":
        return <UpcomingTasksComponent />;
        break;
    }
  };
  return (
    <div className="flex h-full flex-col">
      <header className="flex border-b border-border-default px-6">
        <ProfilePic />
        <div>
          <h3 className=" pt-6 text-xl font-medium hover:underline">My task</h3>
          <nav className="">
            <ul className="flex">
              {componentTypes.map((navItem) => (
                <li
                  className={` ${
                    activeComponent === navItem
                      ? "navbarBorderB text-inherit"
                      : "navbarBorderBHover"
                  } ml-2 px-2 py-1 text-sm text-muted-dark first:ml-0`}
                  onClick={() => setactiveComponent(navItem)}
                  key={navItem}
                >
                  {navItem}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <div className="-6 flex flex-1 py-2">{renderActiveComponent()}</div>
    </div>
  );
};

export default MyTasksWidget;
