import React from "react";
import Skeleton from "react-loading-skeleton";
import LoadingThemeProvider from "../LoadingThemeProvider";
import BoardCardSkeletonLoader from "./BoardCardSkeletonLoader";

const BoardSkeletonLoader = () => {
  return (
    <LoadingThemeProvider>
      <div className="flex overflow-hidden px-8">
        <BoardCardSkeletonLoader showTasksSkeleton={false} />
        <BoardCardSkeletonLoader showTasksSkeleton />
        <div className="flex h-[60px] w-[280px] items-center gap-2 rounded-lg bg-bg-primary px-4">
          <Skeleton height={20} width={20} borderRadius={6} />
          <Skeleton height={15} width={142} />
        </div>
      </div>
    </LoadingThemeProvider>
  );
};

export default BoardSkeletonLoader;
