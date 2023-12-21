import { widgetTypes } from "@/interfaces/widgetRenderSettings";
import React, { ReactNode, DragEvent, useEffect, useState } from "react";

const SidebarWidgetCompWrapper = ({
  children,
  widgetType,
  setIsMouseDownOnSidebarWidget,
  widgetTypes,
  setWidgetTypes,
}: {
  children: ReactNode;
  widgetType: string;
  setIsMouseDownOnSidebarWidget: (c: boolean) => void;
  widgetTypes: widgetTypes[];
  setWidgetTypes: (c: widgetTypes[]) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  function drag(e: DragEvent) {
    setTimeout(() => {
      () => setIsDragging(true);
    }, 1);
    setIsMouseDownOnSidebarWidget(true);
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", widgetType);
    }
    // const currentWidgetIndex = widgetTypes.findIndex(
    //   (widget) => widget === widgetType,
    // );
    // const widgetTypesArrCopy = [...widgetTypes];
    // if (currentWidgetIndex !== -1)
    //   widgetTypesArrCopy.splice(currentWidgetIndex, 0, "_blank");
    // setWidgetTypes(widgetTypesArrCopy);
  }
  const dragEnd = (e: DragEvent) => {
    setIsDragging(false);
    setIsMouseDownOnSidebarWidget(false);
  };
  return (
    <div
      key={widgetType}
      className={`relative h-[200px] w-[200px] rounded-lg ${
        widgetType === "_blank" ? "bg-slate-200" : "bg-red-200"
      } p-4 text-black`}
      // onMouseDown={(e) => handleMouseDown(widget)}
      draggable
      onDragStart={drag}
      onDragEnd={dragEnd}
      id={widgetType + "_sidebar"}
    >
      {isDragging && <div className="absolute inset-0 bg-pink-950" />}

      {children}
    </div>
  );
};

export default SidebarWidgetCompWrapper;
