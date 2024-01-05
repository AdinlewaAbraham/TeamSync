import {
  DashboardWidget,
  DashboardWidgetTypes,
} from "@/interfaces/DashboardWidget";
import React, { ReactNode, DragEvent } from "react";
import NumberChart from "./NumberChart";
import ColumnBar from "./ColumnBar";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";

const renderWidetComponent = (widgetType: DashboardWidgetTypes) => {
  switch (widgetType) {
    case "number":
      return <NumberChart />;
    case "column":
      return <ColumnBar />;
    case "doughnut":
      return <DoughnutChart />;
    case "line":
      return <LineChart />;
    default:
      return <NumberChart />;
  }
};
const ChartsWidgetWrapper = ({
  widget,
  setDashboardwidgets,
}: {
  widget: DashboardWidget;
  setDashboardwidgets: (c: DashboardWidget[]) => void;
}) => {
  const drag = (e: DragEvent) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", widget.type);
    }
  };

  const dragEnd = (e: DragEvent) => {
    // setIsDragging(false);
    // setIsMouseDownOnSidebarWidget(false);
  };
  return (
    <div
      className="bordernflex items-center justify-center p-2"
      style={{ width: widget.width }}
      draggable
      onDragStart={drag}
      onDragEnd={dragEnd}
    >
      <div className="h-[400px] overflow-hidden border">
        {renderWidetComponent(widget.type)}
      </div>
    </div>
  );
};

export default ChartsWidgetWrapper;
