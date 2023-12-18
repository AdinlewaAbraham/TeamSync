import React, { useState } from "react";
import ProjectWidget from "./widgets/ProjectWidget";
import MyTasksWidget from "./widgets/MyTasksWidget";
import WidgetWrapper from "./widgets/WidgetWrapper";
type widgetTypes = "project" | "mytask";
export interface WidgetRenderSettings {
  type: widgetTypes;
  fullWidth: boolean;
}
const WidgetComponent = ({
  widgetsArray,
  setWidgetsArray,
}: {
  widgetsArray: WidgetRenderSettings[];
  setWidgetsArray: (c: WidgetRenderSettings[]) => void;
}) => {
  const renderWidget = (WidgetRenderSettings: WidgetRenderSettings) => {
    switch (WidgetRenderSettings.type) {
      case "project":
        return <ProjectWidget />;
      case "mytask":
        return <MyTasksWidget />;
      default:
        return <>invalid widget type</>;
    }
  };
  return (
    <div className="flex flex-wrap" id="widgetDropZone">
      {widgetsArray.map((WidgetRenderSettings) => (
        <WidgetWrapper
          children={renderWidget(WidgetRenderSettings)}
          WidgetRenderSettings={WidgetRenderSettings}
          widgetsArray={widgetsArray}
          setWidgetsArray={setWidgetsArray}
        />
      ))}
    </div>
  );
};

export default WidgetComponent;
