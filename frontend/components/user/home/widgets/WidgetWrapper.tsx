import React, { ReactNode, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoCheckmark } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { usePopper } from "react-popper";
import WidgetRenderSettings from "@/interfaces/widgetRenderSettings";

const WidgetWrapper = ({
  children,
  WidgetRenderSettings,
  widgetsArray,
  setWidgetsArray,
  isMouseDownOnSidebarWidget,
}: {
  children: ReactNode;
  WidgetRenderSettings: WidgetRenderSettings;
  widgetsArray: WidgetRenderSettings[];
  setWidgetsArray: (c: WidgetRenderSettings[]) => void;
  isMouseDownOnSidebarWidget: boolean;
}) => {
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const changeWFullWidthBoolean = (boolean: boolean) => {
    const indexOfCurrentWidget = widgetsArray.findIndex(
      (widget) => widget.type === WidgetRenderSettings.type,
    );
    if (indexOfCurrentWidget !== -1) {
      const widgetsArrayCopy = [...widgetsArray];
      widgetsArrayCopy.splice(indexOfCurrentWidget, 1, {
        ...WidgetRenderSettings,
        fullWidth: boolean,
      });
      console.log(widgetsArrayCopy);
      setWidgetsArray(widgetsArrayCopy);
    }
  };

  const removeWidget = () => {
    setWidgetsArray(
      widgetsArray.filter(
        (widget) => widget.type !== WidgetRenderSettings.type,
      ),
    );
  };

  return (
    <div
      className="relative p-2"
      style={{ width: WidgetRenderSettings.fullWidth ? "100%" : "50%" }}
      id={WidgetRenderSettings.type}
    >
      {isMouseDownOnSidebarWidget && (
        <div
          className="absolute inset-0 z-10 bg-transparent bg-opacity-70"
          id={WidgetRenderSettings.type}
        />
      )}
      <div
        className={`group relative h-[400px] cursor-pointer rounded-lg border border-border-default p-4 ${
          WidgetRenderSettings.type === "_blank" && "bg-slate-500"
        } `}
      >
        <div
          className={`absolute right-5 top-5 ${
            showWidgetModal ? "block" : "hidden"
          }  rounded-lg border border-border-default p-4 transition-all duration-150 ${
            WidgetRenderSettings.type !== "_blank" && "group-hover:block"
          }`}
          onClick={() => setShowWidgetModal(!showWidgetModal)}
          ref={setReferenceElement}
        >
          <BsThreeDots />
        </div>
        {showWidgetModal && (
          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <ul
              className="[&>li]: rounded-lg border border-border-default bg-bg-primary py-1
              [&>li>i]:col-span-2 [&>li>i]:flex [&>li>i]:items-center [&>li>i]:justify-center
               [&>li>span]:col-span-6 [&>li>span]:text-sm
            [&>li]:grid [&>li]:h-9 [&>li]:grid-cols-9 [&>li]:items-center hover:[&>li]:bg-menuItem-active "
            >
              <li onClick={() => changeWFullWidthBoolean(false)}>
                <i>{!WidgetRenderSettings.fullWidth && <IoCheckmark />}</i>
                <span> Half size</span>
              </li>
              <li onClick={() => changeWFullWidthBoolean(true)}>
                <i>{WidgetRenderSettings.fullWidth && <IoCheckmark />}</i>
                <span>Full size</span>
              </li>
              <div className="my-1 h-0 w-full border-t border-border-default" />
              <li className="text-red-400 " onClick={removeWidget}>
                <i>
                  <RiDeleteBin5Line />
                </i>
                <span> Remove widget</span>
              </li>
            </ul>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default WidgetWrapper;
