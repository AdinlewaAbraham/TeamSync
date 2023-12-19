"use client";
import UserHomePageHeaderComponent from "@/components/user/home/UserHomePageHeaderComponent";
import WidgetComponent from "@/components/user/home/WidgetComponent";
import WidgetRenderSettings from "@/interfaces/widgetRenderSettings";
import AddWidgetSidebar from "@/components/user/home/widgets/AddWidgetSidebar";
import { AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const { userId } = useParams();
  const [showAddWidgetSideBar, setShowAddWidgetSideBar] = useState(false);
  const [isMouseDownOnSidebarWidget, setIsMouseDownOnSidebarWidget] =
    useState(false);
  const defaultWidgetArr: WidgetRenderSettings[] = [
    { type: "_blank", fullWidth: false },
    { type: "mytask", fullWidth: false },
    { type: "project", fullWidth: true },
  ];
  const [widgetsArray, setWidgetsArray] =
    useState<WidgetRenderSettings[]>(defaultWidgetArr);
  if (!userId) return <div>loading...</div>;
  return (
    <div className=" absolute inset-0 flex flex-1 flex-col items-center ">
      <AnimatePresence>
        {showAddWidgetSideBar && (
          <AddWidgetSidebar
            setShowAddWidgetSideBar={setShowAddWidgetSideBar}
            widgetsArray={widgetsArray}
            setWidgetsArray={setWidgetsArray}
            isMouseDownOnSidebarWidget={isMouseDownOnSidebarWidget}
            setIsMouseDownOnSidebarWidget={setIsMouseDownOnSidebarWidget}
          />
        )}
      </AnimatePresence>
      <div className="flex h-full w-full justify-center overflow-y-auto">
        <div className="relative flex w-full max-w-6xl flex-1 flex-col gap-6 px-6">
          <UserHomePageHeaderComponent
            userId={typeof userId === "object" ? userId[0] : userId}
            setShowAddWidgetSideBar={setShowAddWidgetSideBar}
          />
          <WidgetComponent
            widgetsArray={widgetsArray}
            setWidgetsArray={setWidgetsArray}
            isMouseDownOnSidebarWidget={isMouseDownOnSidebarWidget}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
