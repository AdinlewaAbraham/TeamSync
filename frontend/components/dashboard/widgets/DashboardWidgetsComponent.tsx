import React, { useState } from "react";
import WidgetCreatorModal from "./WidgetCreatorModal";

const DashboardWidgetsComponent = () => {
  const defaultWidgetArr = [
    { type: "mytask", fullWidth: false },
    { type: "project", fullWidth: false },
  ];
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(true);
  return (
    <div className="flex-1 ">
      {showAddWidgetModal && (
        <WidgetCreatorModal setShowAddWidgetModal={setShowAddWidgetModal} />
      )}
    </div>
  );
};

export default DashboardWidgetsComponent;
