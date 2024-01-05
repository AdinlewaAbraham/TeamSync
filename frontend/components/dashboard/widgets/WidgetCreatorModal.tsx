import React from "react";
import DoughnutChart from "./charts/DoughnutChart";
import ColumnBar from "./charts/ColumnBar";
import LineChart from "./charts/LineChart";
import { MdClose } from "react-icons/md";

const WidgetCreatorModal = ({
  setShowAddWidgetModal,
}: {
  setShowAddWidgetModal: (c: boolean) => void;
}) => {
  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="z-50 flex h-3/4 w-3/4 max-w-5xl flex-col rounded-lg bg-bg-primary">
        <header className="flex justify-between border-b border-border-default p-4">
          <h3>Edit chart</h3>
          <i
            className="cursor-pointer p-1 text-2xl text-icon-default transition-colors duration-150 hover:text-white"
            onClick={() => setShowAddWidgetModal(false)}
          >
            <MdClose />
          </i>
        </header>
        <div className="flex flex-1 flex-row">
          <div className="relative flex w-[70%] items-center justify-center overflow-auto border-r border-border-default">
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <LineChart />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="relative flex-1 border-b border-border-default">
              <div className="absolute inset-0 overflow-auto">
                <input type="text" className="mb-[5000px]" />
                <p>ere</p>
              </div>
            </div>
            <div>
              <button>cancel</button>
              <button>save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetCreatorModal;
