import React from "react";
import LoadingThemeProvider from "../LoadingThemeProvider";
import Skeleton from "react-loading-skeleton";

const SubLayoutNavbarLoading = () => {
  return (
    <LoadingThemeProvider>
      <div>
        <div className="mb-2 ml-4 mt-4 flex items-center">
          <div className="mr-2">
            <Skeleton borderRadius={8} height={40} width={40} />
          </div>
          <div className="mx-2">
            <Skeleton
              borderRadius={4}
              height={15}
              width={140}
              className="mx--2 "
            />
          </div>
        </div>

        <ul className="ml-4 flex rounded-lg p-2 pb-0 pl-0">
          <Skeleton
            borderRadius={4}
            count={5}
            containerClassName="flex"
            className="mr-2"
            height={10}
            width={40}
          />
        </ul>
      </div>
    </LoadingThemeProvider>
  );
};

export default SubLayoutNavbarLoading;
