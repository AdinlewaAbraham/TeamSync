import WidgetRenderSettings from "@/interfaces/widgetRenderSettings";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const AddWidgetSidebar = ({
  setShowAddWidgetSideBar,
  widgetsArray,
  setWidgetsArray,
}: {
  setShowAddWidgetSideBar: (c: boolean) => void;
  widgetsArray: WidgetRenderSettings[];
  setWidgetsArray: (c: WidgetRenderSettings[]) => void;
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const handleMouseDown = () => {
    setIsMouseDown(true);
  };
  useEffect(() => {
    if (isMouseDown) {
      document.body.classList.add("select-none");
    } else {
      document.body.classList.remove("select-none");
    }
    const handleMouseUp = (e: MouseEvent) => {
      const currentHoverTargetElement = e.target as HTMLElement;
      if (currentHoverTargetElement.closest("#widgetDropZone")) {
        setWidgetsArray([...widgetsArray, { type: "mytask", fullWidth: true }]);
        console.log("in drop zone");
      }
      setIsMouseDown(false);
    };
    const handleMouseMove = (e: MouseEvent) => {
      //   const currentHoverTargetElement = e.target as HTMLElement;
      //   if (currentHoverTargetElement.id === ""){
      //   }
      //   console.log(e.target);
    };
    if (isMouseDown) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isMouseDown]);

  return (
    <div className="absolute bottom-0 right-0 top-0 z-30 border-l border-border-default bg-bg-primary">
      <motion.div
        initial={{
          width: 0,
          opacity: 0,
        }}
        animate={{
          width: "400px",
          opacity: 1,
        }}
        exit={{
          width: 0,
          opacity: 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sticky top-0 h-full w-[400px] overflow-y-auto overflow-x-hidden"
      >
        <header>
          <button
            className="bg-red-50 p-4"
            onClick={() => setShowAddWidgetSideBar(false)}
          >
            close
          </button>
          <h4 className="">Widgets</h4>
          <p>
            Drag to add the widgets below to your Home screen. You can also
            reorder and remove them.
          </p>
        </header>
        <div>
          <div
            className="h-[300px] bg-red-200 text-black"
            onMouseDown={handleMouseDown}
          >
            private notepad
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddWidgetSidebar;
