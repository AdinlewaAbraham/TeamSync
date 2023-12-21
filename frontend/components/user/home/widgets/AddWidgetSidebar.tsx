import WidgetRenderSettings, {
  widgetTypes,
} from "@/interfaces/widgetRenderSettings";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";
import SidebarWidgetCompWrapper from "./SidebarWidgetCompWrapper";

const AddWidgetSidebar = ({
  setShowAddWidgetSideBar,
  widgetsArray,
  setWidgetsArray,
  isMouseDownOnSidebarWidget,
  setIsMouseDownOnSidebarWidget,
}: {
  setShowAddWidgetSideBar: (c: boolean) => void;
  widgetsArray: WidgetRenderSettings[];
  setWidgetsArray: (c: WidgetRenderSettings[]) => void;
  isMouseDownOnSidebarWidget: boolean;
  setIsMouseDownOnSidebarWidget: (c: boolean) => void;
}) => {
  const widgetTypesDefault = [
    "project",
    "mytask",
    "privatenote",
    "taskiassigned",
  ].filter(
    (widget) => !widgetsArray.some((arrWidget) => arrWidget.type === widget),
  ) as widgetTypes[];
  const [widgetTypes, setWidgetTypes] =
    useState<widgetTypes[]>(widgetTypesDefault);
  useEffect(() => {
    const newWidgetTypesArr = [
      "project",
      "mytask",
      "privatenote",
      "taskiassigned",
    ].filter(
      (widget) => !widgetsArray.some((arrWidget) => arrWidget.type === widget),
    ) as widgetTypes[];
    setWidgetTypes(newWidgetTypesArr);
  }, [widgetsArray]);

  return (
    <div className="absolute bottom-0 right-0 top-0 z-30 border-l border-border-default bg-bg-primary">
      <motion.div
        initial={{
          width: 0,
          opacity: 0,
        }}
        animate={{
          width: "350px",
          opacity: 1,
        }}
        exit={{
          width: 0,
          opacity: 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sticky top-0 h-full w-[350px] overflow-y-auto overflow-x-hidden "
      >
        <div className="mx-4">
          <header className="sticky top-0 flex items-center justify-between bg-bg-primary py-4">
            <h3>Customize home</h3>
            <button
              className="rounded-lg p-2 text-lg hover:bg-menuItem-active"
              onClick={() => setShowAddWidgetSideBar(false)}
            >
              <GoSidebarCollapse />
            </button>
          </header>
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="">Widgets</h4>
              <p>
                Drag to add the widgets below to your Home screen. You can also
                reorder and remove them.
              </p>
            </div>
            {widgetTypes.map((widgetType) => (
              <SidebarWidgetCompWrapper
                children={widgetType}
                widgetType={widgetType}
                key={widgetType}
                widgetTypes={widgetTypes}
                setWidgetTypes={setWidgetTypes}
                setIsMouseDownOnSidebarWidget={setIsMouseDownOnSidebarWidget}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddWidgetSidebar;
