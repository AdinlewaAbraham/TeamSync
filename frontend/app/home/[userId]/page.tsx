"use client";
import UserHomePageHeaderComponent from "@/components/user/home/UserHomePageHeaderComponent";
import WidgetComponents from "@/components/user/home/widgets/widgetComponents/WidgetComponents";
import WidgetRenderSettings, {
  widgetTypes,
} from "@/interfaces/widgetRenderSettings";
import AddWidgetSidebar from "@/components/user/home/widgets/addWidgetSidebar/AddWidgetSidebar";
import { AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page: React.FC = () => {
  const { userId } = useParams();
  const [showAddWidgetSideBar, setShowAddWidgetSideBar] = useState(false);
  const [isMouseDownOnSidebarWidget, setIsMouseDownOnSidebarWidget] =
    useState(false);
  const [currentDraggedElementType, setCurrentDraggedElementType] =
    useState<widgetTypes | null>();
  const defaultWidgetArr: WidgetRenderSettings[] = [
    { type: "mytask", fullWidth: false },
    { type: "project", fullWidth: false },
  ];
  const [widgetsArray, setWidgetsArray] =
    useState<WidgetRenderSettings[]>(defaultWidgetArr);
  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDownOnSidebarWidget(false);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

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
          <WidgetComponents
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
