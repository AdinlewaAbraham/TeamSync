import React, { useState } from "react";
import { FaUserAlt } from "react-icons/fa";

const UserImgComponent = ({
  src,
  styles,
  alt,
  height,
  width,
}: {
  src: string ;
  styles: string;
  alt: string;
  height: number;
  width: number;
}) => {
  const [didImgFailToLoad, setDidImgFailToLoad] = useState(false);
  return (
    <div
      className={`h-[${height}px] w-[${width}px] ${styles} ${
        didImgFailToLoad && "bg-gray-400"
      } flex items-center justify-center overflow-hidden`}
    >
      {didImgFailToLoad ? (
        <i className={`text-black `}>
          <FaUserAlt />
        </i>
      ) : (
        <img src={src} alt="" onError={() => setDidImgFailToLoad(true)} />
      )}
    </div>
  );
};

export default UserImgComponent;
