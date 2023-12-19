import WidgetRenderSettings, {
  widgetTypes,
} from "@/interfaces/widgetRenderSettings";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";

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
  const [currentDraggedElement, setCurrentDraggedElement] =
    useState<widgetTypes | null>();
  const handleMouseDown = (widgetKey: widgetTypes) => {
    setIsMouseDownOnSidebarWidget(true);
    setCurrentDraggedElement(widgetKey);
  };
  useEffect(() => {
    if (isMouseDownOnSidebarWidget) {
      document.body.classList.add("select-none");
    } else {
      document.body.classList.remove("select-none");
    }
    const handleMouseUp = (e: MouseEvent) => {
      const currentHoverTargetElement = e.target as HTMLElement;
      document.body.classList.remove("cursor-no-drop");
      document.body.classList.remove("cursor-copy");
      const filteredWidgetsArray = [...widgetsArray].filter(
        (widget) => widget.type !== "_blank",
      );
      if (
        currentHoverTargetElement.closest("#widgetDropZone") &&
        currentDraggedElement
      ) {
        setWidgetsArray([
          ...filteredWidgetsArray,
          { type: currentDraggedElement, fullWidth: false },
        ]);
      } else {
        setWidgetsArray(filteredWidgetsArray);
      }
      setIsMouseDownOnSidebarWidget(false);
    };
    const handleMouseMove = (e: MouseEvent) => {
      const currentHoverTargetElement = e.target as HTMLElement;
      if (
        currentHoverTargetElement.closest("#widgetDropZone") &&
        currentDraggedElement
      ) {
        // in dropzone
        const currentHoverTargetElementId = currentHoverTargetElement.id;
        console.log(currentHoverTargetElementId);
        if (currentHoverTargetElementId !== "_blank") {
          const currentHoverTargetElementIndex = widgetsArray.findIndex(
            (widget) => widget.type === currentHoverTargetElement.id,
          );
          if (currentHoverTargetElementIndex !== -1) {
            // splice and stuff
            const widgetsArrCopy = [...widgetsArray];
            widgetsArrCopy.splice(currentHoverTargetElementIndex, 0, {
              fullWidth: false,
              type: "_blank",
            });
            setWidgetsArray(widgetsArrCopy);
          }
        }

        document.body.classList.add("cursor-copy");
      } else {
        document.body.classList.remove("cursor-copy");
        document.body.classList.add("cursor-no-drop");
      }
    };
    if (isMouseDownOnSidebarWidget) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isMouseDownOnSidebarWidget]);
  const widgetTypes = [
    "project",
    "mytask",
    "privatenote",
    "taskiassigned",
  ].filter(
    (widget) => !widgetsArray.some((arrWidget) => arrWidget.type === widget),
  ) as widgetTypes[];
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
            {widgetTypes.map((widget) => (
              <div
                key={widget}
                className="h-[200px] rounded-lg bg-red-200 p-4 text-black"
                onMouseDown={() => handleMouseDown(widget)}
              >
                {widget}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddWidgetSidebar;
