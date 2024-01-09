import React from "react";
import Image from "next/image";
import lightSkinInBushHeadshot from "../../../../assects/headshots/lightSkinInBush.jpeg";
import whiteLadyGrayBG from "../../../../assects/headshots/whiteLadyGrayBG.jpeg";
import whiteManwhiteBG from "../../../../assects/headshots/whiteManwhiteBG.jpeg";
import blackWomanWhiteBG from "../../../../assects/headshots/blackWomanWhiteBG.jpg";
import whiteManRedShirt from "../../../../assects/headshots/whiteManRedShirt.jpg";
import asianManGreenBG from "../../../../assects/headshots/asianManGreenBG.jpeg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const taskObject: {
  [key: string]: {
    rowWidthCount: number;
    bgColor: string;
    propUserImg: string | StaticImport;
  };
} = {
  "00": {
    rowWidthCount: 1,
    bgColor: "#f1bd6c",
    propUserImg: lightSkinInBushHeadshot,
  },
  "02": { rowWidthCount: 1, bgColor: "#36b8b1", propUserImg: whiteLadyGrayBG },
  "11": { rowWidthCount: 1, bgColor: "#f06a6a", propUserImg: asianManGreenBG },
  "13": {
    rowWidthCount: 2,
    bgColor: "#e87db3",
    propUserImg: blackWomanWhiteBG,
  },
  "21": { rowWidthCount: 1, bgColor: "#4573d2", propUserImg: whiteManRedShirt },
  "22": { rowWidthCount: 2, bgColor: "#f1bd6c", propUserImg: whiteLadyGrayBG },
  "24": { rowWidthCount: 1, bgColor: "#a9dcd9", propUserImg: whiteManwhiteBG },
  "31": {
    rowWidthCount: 1,
    bgColor: "#938ce1",
    propUserImg: lightSkinInBushHeadshot,
  },
  "34": {
    rowWidthCount: 3,
    bgColor: "#f6a0a3",
    propUserImg: blackWomanWhiteBG,
  },
};
const CalendarVisualizerBox = ({
  rowIndex,
  index,
}: {
  rowIndex: number;
  index: number;
}) => {
  const boxPropTask = taskObject?.[rowIndex + `${index}`];
  return (
    <div
      className={`${rowIndex === 0 && "border-t-0"} 
      border-b-0 border-l-0 last:border-r-0 relative h-full border-[0.1px] border-border-default`}
    >
      <div className="m-2 mb-0 h-3 w-3 rounded-full bg-border-default" />
      {boxPropTask && (
        <div
          className={`relative z-50 flex h-10 items-center justify-center `}
          style={{
            width: boxPropTask.rowWidthCount + "00%",
          }}
        >
          <div
            className="absolute w-[calc(100%-16px)] rounded-lg border flex items-center border-border-default px-2 py-1"
            style={{
              backgroundColor: boxPropTask.bgColor,
            }}
          >
            <div className="h-5 w-5 rounded-full bg-menuItem-active mr-2">
              {boxPropTask.propUserImg && (
                <Image
                  src={boxPropTask.propUserImg}
                  alt="profile pic"
              className="h-5 w-5 rounded-full object-cover"
              draggable={false}
                />
              )}
            </div>
            <div className={`bg-black bg-opacity-25 h-2 w-11 rounded-full `}/>
          </div>
        </div>
      )}
      {rowIndex === 1 && index === 3 && (
        <div className={`px-2 `} style={{ width: "100%" }}>
          <div
            className="rounded-lg border border-border-default flex items-center px-2 py-1"
            style={{
              backgroundColor: taskObject["31"].bgColor,
            }}
          >
            <div className="h-5 w-5 rounded-full bg-menuItem-active mr-2">
              {taskObject["11"].propUserImg && (
                <Image
                  src={taskObject["11"].propUserImg}
                  alt="profile pic"
                  className="h-5 w-5 rounded-full object-cover"
                />
              )}
            </div>
            <div className={`bg-black bg-opacity-25 h-2 w-11 rounded-full `}/>
          </div>
        </div>
      )}
    </div>
  );
};

const CalendarVisualizerBoxRow = ({ rowIndex }: { rowIndex: number }) => {
  return (
    <div className="grid grid-flow-col grid-cols-7">
      {Array.from({ length: 7 }).map((undefined, index) => (
        <CalendarVisualizerBox
          index={index}
          rowIndex={rowIndex}
          key={index + `${rowIndex}`}
        />
      ))}
    </div>
  );
};

const CalendarProjectVisualizerComponent = () => {
  return (
    <div className="grid flex-1 grid-flow-row grid-rows-4">
      {Array.from({ length: 4 }).map((undefined, index) => (
        <CalendarVisualizerBoxRow rowIndex={index} key={index} />
      ))}
    </div>
  );
};

export default CalendarProjectVisualizerComponent;
