import React from "react";
import LoadingThemeProvider from "../LoadingThemeProvider";
import Skeleton from "react-loading-skeleton";

const MainLayoutSidebarLoadingComponent = () => {
  const SkeletonPair = ({ width }: { width: number }) => {
    return (
      <div className="flex items-center">
        <Skeleton borderRadius={6} height={22} width={22} className="mr-2 " />
        <Skeleton
          borderRadius={6}
          height={15}
          width={width > 134 ? 134 : width}
          className=" "
        />
      </div>
    );
  };
  return (
    <LoadingThemeProvider>
      <div className=" flex flex-1 flex-col justify-between overflow-hidden px-4 ">
        <div className="flex flex-col gap-6 p-4">
          <div>
            {[105, 134, 90].map((width) => (
              <SkeletonPair key={width} width={width} />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton
              borderRadius={6}
              height={15}
              width={140}
              className="flex items-center"
            />
            {[81, 130, 65, 100].map((width) => (
              <SkeletonPair key={width} width={width} />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton
              borderRadius={6}
              height={15}
              width={140}
              className="flex items-center"
            />
            {[102, 132, 110, 80].map((width) => (
              <SkeletonPair key={width} width={width} />
            ))}
          </div>
        </div>
        <div className="flex items-center p-4">
          <Skeleton
            borderRadius={9999}
            height={32}
            width={32}
            className="mr-2 flex items-center"
          />
          <Skeleton
            borderRadius={6}
            height={15}
            width={120}
            className="flex items-center"
          />
        </div>
      </div>
    </LoadingThemeProvider>
  );
};

export default MainLayoutSidebarLoadingComponent;
