import React, { useState, DragEvent } from "react";
import ProjectWidget from "../projects/ProjectWidget";
import MyTasksWidget from "../myTask/MyTasksWidget";
import WidgetDraggableWrapper from "./WidgetDraggableWrapper";
import WidgetRenderSettings, {
  widgetTypes,
} from "@/interfaces/widgetRenderSettings";
import PrivateNoteWidget from "../privateNote/PrivateNoteWidget";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import TasksAssigned from "../taskAssigned/TasksAssigned";
const WidgetComponents = ({
  widgetsArray,
  setWidgetsArray,
  isMouseDownOnSidebarWidget,
}: {
  widgetsArray: WidgetRenderSettings[];
  setWidgetsArray: (c: WidgetRenderSettings[]) => void;
  isMouseDownOnSidebarWidget: boolean;
}) => {
  const [animateListParent] = useAutoAnimate();
  const [currentHoverTargetElementIndex, setCurrentHoverTargetElementIndex] =
    useState(-1);
  const renderWidget = (WidgetRenderSettings: WidgetRenderSettings) => {
    switch (WidgetRenderSettings.type) {
      case "project":
        return <ProjectWidget />;
      case "mytask":
        return <MyTasksWidget />;
      case "privatenote":
        return <PrivateNoteWidget />;
      case "taskiassigned":
        return <TasksAssigned />;
      case "_blank":
        return <div className="" />;
      default:
        return <>invalid widget type</>;
    }
  };
  const allowDrop = (e: DragEvent) => {
    if (e) e.preventDefault();
    const currentHoverTargetElement = e.target as HTMLElement;
    const filteredWidgetsArray = [...widgetsArray].filter(
      (widget) => widget.type !== "_blank",
    );
    // const currentDraggedElementIndex = widgetTypes.findIndex(
    //   (widgetType) => widgetType === currentDraggedElementType,
    // );
    // if (currentDraggedElementIndex !== -1) { //for sidebar
    //   const newWigetTypes = [...widgetTypes];
    //   newWigetTypes.splice(currentDraggedElementIndex, 0, "_blank");
    //   setWidgetTypes(newWigetTypes);
    // }

    if (currentHoverTargetElement.id !== "_blank") {
      const _currentHoverTargetElementIndex = widgetsArray.findIndex(
        (widget) => widget.type === currentHoverTargetElement.id,
      );
      setCurrentHoverTargetElementIndex(_currentHoverTargetElementIndex);
      console.log(_currentHoverTargetElementIndex);
      console.log(currentHoverTargetElement);
      if (_currentHoverTargetElementIndex !== -1) {
        // splice and stuff
        const widgetsArrCopy = [...widgetsArray].filter(
          (widget) => widget.type !== "_blank",
        );
        widgetsArrCopy.splice(_currentHoverTargetElementIndex, 0, {
          fullWidth: false,
          type: "_blank",
        });
        setWidgetsArray(widgetsArrCopy);
      }
    }
  };
  function drop(e: DragEvent) {
    e.preventDefault();
    console.log(e.target);
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain") as widgetTypes;
      console.log(data);
      const widgetArrayCopy = [...widgetsArray].filter(
        (widget) => widget.type !== "_blank",
      );
      if (currentHoverTargetElementIndex !== -1 || data) {
        widgetArrayCopy.splice(currentHoverTargetElementIndex, 0, {
          fullWidth: false,
          type: data,
        });
        console.log(data);
      }
      setWidgetsArray(widgetArrayCopy);
    }
  }
  const dragLeave = (e: DragEvent) => {
    // remove the _blank element
    setWidgetsArray(widgetsArray.filter((widget) => widget.type !== "_blank"));
  };
  return (
    <div
      className="flex flex-1 flex-wrap"
      id="widgetDropZone"
      ref={animateListParent}
      onDragOver={allowDrop}
      onDrop={drop}
      onDragLeave={dragLeave}
    >
      {widgetsArray.map((WidgetRenderSettings) => (
        <WidgetDraggableWrapper
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

export default WidgetComponents;
