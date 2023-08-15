import React, { useContext } from "react";
import { useGlobalContext } from "@/context/GeneralContext";
import { RxHamburgerMenu } from "react-icons/rx";
const Navbar = () => {
  const { showSidebar, setShowSidebar } = useGlobalContext();
  return (
    <div className="w-full h-[50px] flex items-center px-3">
      <i
        className="cursor-pointer text-white"
        onClick={() => {
          setShowSidebar(!showSidebar);
        }}
      >
        <RxHamburgerMenu />
      </i>
    </div>
  );
};

export default Navbar;
