import { StaticImport } from "next/dist/shared/lib/get-img-props";
import React from "react";
import Image from "next/image";
import lightSkinInBushHeadshot from "../../../../assects/headshots/lightSkinInBush.jpeg";
import whiteLadyGrayBG from "../../../../assects/headshots/whiteLadyGrayBG.jpeg";
import whiteManwhiteBG from "../../../../assects/headshots/whiteManwhiteBG.jpeg";
import blackWomanWhiteBG from "../../../../assects/headshots/blackWomanWhiteBG.jpg";
import whiteManRedShirt from "../../../../assects/headshots/whiteManRedShirt.jpg";
import asianManGreenBG from "../../../../assects/headshots/asianManGreenBG.jpeg";

const timlineTasksRenderHashMap: {
  [key: string]: {
    noOfColumnsToOccupy: number;
    bgColor: string;
    userImg: string | StaticImport;
  };
} = {
  "01": {
    noOfColumnsToOccupy: 2,
    bgColor: "#36b8b1",
    userImg: lightSkinInBushHeadshot,
  },
  "32": {
    noOfColumnsToOccupy: 2,
    bgColor: "#f06a6a",
    userImg: whiteManwhiteBG,
  },
  "13": {
    noOfColumnsToOccupy: 1,
    bgColor: "#4573d2",
    userImg: blackWomanWhiteBG,
  },
  "24": {
    noOfColumnsToOccupy: 3,
    bgColor: "#f1bd6c",
    userImg: whiteManRedShirt,
  },
  "15": {
    noOfColumnsToOccupy: 2,
    bgColor: "#a9dcd9",
    userImg: lightSkinInBushHeadshot,
  },
  "36": {
    noOfColumnsToOccupy: 2,
    bgColor: "#f6a0a3",
    userImg: whiteLadyGrayBG,
  },
  "07": {
    noOfColumnsToOccupy: 2,
    bgColor: "#938ce1",
    userImg: asianManGreenBG,
  },
  "28": {
    noOfColumnsToOccupy: 2,
    bgColor: "#f06a6a",
    userImg: lightSkinInBushHeadshot,
  },
};

const TaskBarVisualizerComponent = ({
  userImg,
  bgColor,
  noOfColumnsToOccupy,
}: {
  userImg: string | StaticImport;
  bgColor: string;
  noOfColumnsToOccupy: number;
}) => {
  return (
    <div
      className="absolute px-2"
      style={{ width: noOfColumnsToOccupy + "00%" }}
    >
      <div
        className="z-30 flex w-full items-center rounded-lg border border-border-default px-2 py-1"
        style={{ backgroundColor: bgColor }}
      >
        <div className="mr-2 h-5 w-5 rounded-full bg-menuItem-active">
          {userImg && (
            <Image
              src={userImg}
              alt="profile pic"
              className="h-5 w-5 rounded-full object-cover"
              draggable={false}
            />
          )}
        </div>
        <div className={`h-2 w-11 rounded-full bg-black bg-opacity-25 `} />
      </div>
    </div>
  );
};
const TaskRowVisualizerComponent = ({
  ColumnIndex,
}: {
  ColumnIndex: number;
}) => {
  return (
    <div className="">
      {Array.from({ length: 19 }).map((undefined, rowIndex) => {
        const taskRenderobject =
          timlineTasksRenderHashMap?.[`${ColumnIndex}` + `${rowIndex}`];
        return (
          <div
            className="relative flex h-12 w-full items-center"
            key={`${ColumnIndex}_${rowIndex}`}
          >
            {taskRenderobject && (
              <TaskBarVisualizerComponent
                bgColor={taskRenderobject.bgColor}
                noOfColumnsToOccupy={taskRenderobject.noOfColumnsToOccupy}
                userImg={taskRenderobject.userImg}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const TimelineProjectVisualizerComponent = () => {
  return (
    <div className="relative flex flex-1">
      <div className="absolute inset-0 grid max-h-full flex-1 grid-flow-col grid-cols-5 overflow-hidden">
        {Array.from({ length: 5 }).map((undefined, ColumnIndex) => (
          <div
            className="border-r border-border-default "
            key={"visual" + ColumnIndex}
          >
            <TaskRowVisualizerComponent
              key={ColumnIndex}
              ColumnIndex={ColumnIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineProjectVisualizerComponent;
