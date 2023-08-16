import React, { useContext } from "react";
import { useGlobalContext } from "@/context/GeneralContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiArrowDropDownLine } from "react-icons/ri";
const Navbar = () => {
  const { showSidebar, setShowSidebar } = useGlobalContext();
  return (
    <div className="w-full h-[50px] flex items-center justify-between px-3 border-b-[1px] bg-bg-primary border-gray-700">
      <div className="flex items-center">
        <i
          className="cursor-pointer text-white mr-10"
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
        >
          <RxHamburgerMenu />
        </i>
        <h1 className="mr-4 ">LOGO</h1>
        <button
          data-after-sm="+"
          data-after-lg="Create"
          className="bg-blue-500 rounded-md sm:p-1 px-3 py-1
    after:content-[attr(data-after-sm)] sm:after:content-[attr(data-after-lg)] "
          onClick={() => console.log("Button clicked")}
        />
      </div>
      <div>
        {/* fix for mobile */}
        <input type="text" className="bg-bg-secondary" />
      </div>
      <div>
        <div className="items-center flex">
          <div className="w-8 h-8 rounded-full bg-slate-400 mr-0.5 "></div>
          <RiArrowDropDownLine size={30} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
