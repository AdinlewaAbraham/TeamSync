import React, { useState, DragEvent } from "react";
import WidgetCreatorModal from "./WidgetCreatorModal";
import ChartsWidgetWrapper from "./charts/ChartsWidgetWrapper";
import { DashboardWidget } from "@/interfaces/DashboardWidget";

const defaultWidgetArr: DashboardWidget[] = [
  { type: "number", width: "25%" },
  { type: "number", width: "25%" },
  { type: "number", width: "25%" },
  { type: "number", width: "25%" },
  { type: "column", width: "50%" },
  { type: "doughnut", width: "50%" },
  { type: "line", width: "100%" },
];
const DashboardWidgetsComponent = () => {
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [dashboardwidgets, setDashboardwidgets] = useState(defaultWidgetArr);
  const allowDrop = (e: DragEvent) => {
    e.preventDefault();
  };
  const dragLeave = () => {};
  const onDrop = (e: DragEvent) => {};
  return (
    <div className="flex flex-1 justify-center overflow-auto">
      <div
        className="flex max-w-6xl flex-wrap p-10"
        onDragOver={allowDrop}
        onDrop={onDrop}
        onDragLeave={dragLeave}
      >
        {showAddWidgetModal && (
          <WidgetCreatorModal setShowAddWidgetModal={setShowAddWidgetModal} />
        )}
        {dashboardwidgets.map((widget, index) => (
          <ChartsWidgetWrapper
            widget={widget}
            setDashboardwidgets={setDashboardwidgets}
            key={widget.type + index}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardWidgetsComponent;
