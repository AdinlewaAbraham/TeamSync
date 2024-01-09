import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import Image from "next/image";
import lightSkinInBushHeadshot from "../../../../assects/headshots/lightSkinInBush.jpeg";
import whiteLadyGrayBG from "../../../../assects/headshots/whiteLadyGrayBG.jpeg";
import whiteManwhiteBG from "../../../../assects/headshots/whiteManwhiteBG.jpeg";
import blackWomanWhiteBG from "../../../../assects/headshots/blackWomanWhiteBG.jpg";
import whiteManRedShirt from "../../../../assects/headshots/whiteManRedShirt.jpg";
import asianManGreenBG from "../../../../assects/headshots/asianManGreenBG.jpeg";

whiteManRedShirt;
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface TaskVisualizerObject {
  userImg: string | StaticImport;
  statusBarColor: string;
  isChecked?: boolean;
}

const BoardProjectVisualizerComponentBoardHeader = ({
  header,
}: {
  header: string;
}) => {
  return (
    <div className="mb-4 flex w-full items-center justify-between">
      <h4>{header}</h4>
      <div className="flex gap-2 text-muted-dark">
        <IoMdAdd /> <BsThreeDots />
      </div>
    </div>
  );
};

const TaskVisualizerComponent = ({
  statusBarColor,
  userImg,
  isChecked,
}: {
  statusBarColor: string;
  userImg: StaticImport | string;
  isChecked?: boolean;
}) => {
  return (
    <div className="mb-2 flex w-[250px] flex-col gap-3 rounded-lg border border-border-default px-4 py-2">
      <div className="flex items-center gap-2">
        <i
          className={`${
            isChecked ? "text-accent-green" : "text-border-default"
          }`}
        >
          <FaRegCircleCheck />
        </i>
        <div className="h-2.5 w-36 rounded-full bg-menuItem-active" />
      </div>
      <div
        className="h-4 w-20 rounded-full"
        style={{ backgroundColor: statusBarColor }}
      />
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-menuItem-active">
          {userImg && (
            <Image
              src={userImg}
              alt="profile pic"
              className="h-6 w-6 rounded-full object-cover"
              draggable={false}
            />
          )}
        </div>
        <div className="h-2 w-10 rounded-lg bg-menuItem-active" />
      </div>
    </div>
  );
};
const BoardProjectVisualizerComponentBoard = ({
  tasksVisualArr,
  header,
}: {
  tasksVisualArr: TaskVisualizerObject[];
  header: string;
}) => {
  return (
    <div>
      <div className="max-w-min rounded-lg bg-bg-secondary p-4">
        <BoardProjectVisualizerComponentBoardHeader header={header} />
        {tasksVisualArr.map((task) => (
          <TaskVisualizerComponent
            statusBarColor={task.statusBarColor}
            userImg={task.userImg}
            isChecked={!!task?.isChecked}
            key={task.isChecked + task.statusBarColor}
          />
        ))}
      </div>
    </div>
  );
};
const renderBoardArray: {
  header: string;
  tasksVisualArr: TaskVisualizerObject[];
}[] = [
  {
    header: "To do",
    tasksVisualArr: [
      {
        userImg: lightSkinInBushHeadshot,
        statusBarColor: "#a9dcd9",
        isChecked: true,
      },
      {
        userImg: whiteLadyGrayBG,
        statusBarColor: "#4573d2",
      },
    ],
  },
  {
    header: "Doing",
    tasksVisualArr: [
      {
        userImg: whiteManwhiteBG,
        statusBarColor: "#938ce1",
      },
      {
        userImg: blackWomanWhiteBG,
        statusBarColor: "#a9dcd9",
        isChecked: true,
      },
      {
        userImg: asianManGreenBG,
        statusBarColor: "#e87db3",
        isChecked: true,
      },
    ],
  },
  {
    header: "Done",
    tasksVisualArr: [
      {
        userImg: whiteManRedShirt,
        statusBarColor: "#4573d2",
        isChecked: true,
      },
    ],
  },
];
const BoardProjectVisualizerComponent = () => {
  return (
    <div className="relative flex-1 ">
      <div className="absolute inset-0 flex flex-1 gap-4 overflow-x-hidden bg-[rgba(46,46,51,0.67)] bg-opacity-75 p-4">
        {renderBoardArray.map((board) => (
          <BoardProjectVisualizerComponentBoard
            tasksVisualArr={board.tasksVisualArr}
            header={board.header}
            key={board.header}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardProjectVisualizerComponent;
``;
