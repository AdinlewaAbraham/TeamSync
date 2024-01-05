import React from "react";
import LoadingThemeProvider from "../../LoadingThemeProvider";
import Skeleton from "react-loading-skeleton";

const DropDownHeaderSkeletonLoader = ({
  width,
  dontShowBorder,
}: {
  width: number;
  dontShowBorder?: boolean;
}) => {
  return (
    <div
      className={`${
        dontShowBorder && "border-b border-border-default"
      } flex h-[50px] items-center`}
    >
      <Skeleton
        width={15}
        height={15}
        borderRadius={4}
        containerClassName="mx-2"
      />
      <Skeleton width={width} height={10} borderRadius={6} />
    </div>
  );
};
const TaskRowSkeletonLoader = () => {
  const TaskStatusSkeletonLoader = () => {
    return (
      <div className="flex w-max items-center rounded-lg border border-border-default p-2 py-0.5">
        <Skeleton
          width={15}
          height={15}
          borderRadius={999}
          containerClassName="mr-2"
        />
        <div className="flex flex-1">
          <Skeleton
            width={70}
            height={10}
            borderRadius={6}
            containerClassName="mr-6"
          />
        </div>
        <Skeleton width={10} height={10} borderRadius={2} />
      </div>
    );
  };
  return (
    <div className="flex h-[50px] w-full items-center justify-between border-b border-border-default p-2 px-8">
      <Skeleton width={50} height={10} borderRadius={6} />
      <div className="flex items-center">
        <Skeleton
          width={20}
          height={20}
          borderRadius={999}
          containerClassName="mr-2"
        />
        <Skeleton width={50} height={10} borderRadius={6} />
      </div>
      <Skeleton width={50} height={10} borderRadius={6} />
      <TaskStatusSkeletonLoader />
      <TaskStatusSkeletonLoader />
    </div>
  );
};
const TableSkeletonLoader = () => {
  return (
    <div className="w-full overflow-hidden pl-10 pr-2">
      <LoadingThemeProvider>
        <div className="rounded-lg border border-border-default">
          <header className="w-full border-b border-border-default p-2">
            <Skeleton
              count={5}
              height={15}
              width={120}
              containerClassName="flex justify-between items-center w-full"
            />
          </header>
          <div>
            <div>
              <DropDownHeaderSkeletonLoader width={100} />
              <TaskRowSkeletonLoader />
              <TaskRowSkeletonLoader />
              <TaskRowSkeletonLoader />
              <TaskRowSkeletonLoader />
              <DropDownHeaderSkeletonLoader width={60} />
              <TaskRowSkeletonLoader />
              <DropDownHeaderSkeletonLoader width={70} dontShowBorder />
            </div>
          </div>
          <footer></footer>
        </div>
      </LoadingThemeProvider>
    </div>
  );
};

export default TableSkeletonLoader;
