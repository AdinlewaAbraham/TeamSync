import React, { useState } from "react";
import ProjectWidget from "./widgets/ProjectWidget";
import MyTasksWidget from "./widgets/MyTasksWidget";
import WidgetWrapper from "./widgets/WidgetWrapper";
import WidgetRenderSettings from "@/interfaces/widgetRenderSettings";
import PrivateNoteWidget from "./widgets/PrivateNoteWidget";
import { useAutoAnimate } from "@formkit/auto-animate/react";
const WidgetComponent = ({
  widgetsArray,
  setWidgetsArray,
  isMouseDownOnSidebarWidget,
}: {
  widgetsArray: WidgetRenderSettings[];
  setWidgetsArray: (c: WidgetRenderSettings[]) => void;
  isMouseDownOnSidebarWidget: boolean;
}) => {
  const [animateListParent] = useAutoAnimate();
  const renderWidget = (WidgetRenderSettings: WidgetRenderSettings) => {
    switch (WidgetRenderSettings.type) {
      case "project":
        return <ProjectWidget />;
      case "mytask":
        return <MyTasksWidget />;
      case "privatenote":
        return <PrivateNoteWidget />;
      case "_blank":
        return <div className="" />;
      default:
        return <>invalid widget type</>;
    }
  };
  return (
    <div
      className="flex flex-1 flex-wrap"
      id="widgetDropZone"
      ref={animateListParent}
    >
      {widgetsArray.map((WidgetRenderSettings) => (
        <WidgetWrapper
          children={renderWidget(WidgetRenderSettings)}
          WidgetRenderSettings={WidgetRenderSettings}
          widgetsArray={widgetsArray}
          setWidgetsArray={setWidgetsArray}
          isMouseDownOnSidebarWidget={isMouseDownOnSidebarWidget}
        />
      ))}
    </div>
  );
};

export default WidgetComponent;
