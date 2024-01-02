import React from "react";
import Skeleton from "react-loading-skeleton";

const BoardCardSkeletonLoader = ({
  showTasksSkeleton,
}: {
  showTasksSkeleton: boolean;
}) => {
  return (
    <div>
      <div className="mr-2 flex max-h-max w-[280px] flex-col items-center rounded-lg bg-bg-primary px-2  py-4">
        <div className="mb-4 flex w-full items-center justify-between ">
          <Skeleton height={15} width={142} />
          <div className="flex gap-2">
            <Skeleton height={20} width={20} borderRadius={6} />
            <Skeleton height={20} width={20} borderRadius={6} />
          </div>
        </div>
        {showTasksSkeleton && (
          <div>
            <div className="mb-2">
              <Skeleton height={100} width={266} />
            </div>
          </div>
        )}
            <div>
              <Skeleton height={100} width={266} />
            </div>
        <div className="mt-4 flex w-full items-center gap-2">
          <Skeleton height={20} width={20} borderRadius={6} />
          <Skeleton height={15} width={142} />
        </div>
      </div>
    </div>
  );
};

export default BoardCardSkeletonLoader;
