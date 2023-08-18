"use client";
import React, { useContext, useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GeneralContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiArrowDropDownLine } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";
import { usePopper } from "react-popper";
const Navbar = () => {
  const { showSidebar, setShowSidebar } = useGlobalContext();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });
  useEffect(() => {
    console.log("just rendered");
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        console.log(window.innerWidth);
        setIsMobile(true);
      } else {
        console.log(window.innerWidth);
        setIsMobile(false);
      }
    };
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const closestAncestor = target.closest(".userMenu");
      if (!closestAncestor) {
        setShowUserMenu(false);
      }
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        {/* remove text for logo and keep only logo for mobile */}
        <h1 className="mr-4 uppercase select-none">teamsync</h1>
        <button
          data-after-sm="+"
          data-after-lg="Create"
          className="accent-color rounded-md sm:p-1 px-3 py-1
         after:content-[attr(data-after-sm)] sm:after:content-[attr(data-after-lg)] "
          onClick={() => console.log("Button clicked")}
        />
      </div>
      <div className="hidden sm:flex">
        <input type="text" className="bg-bg-secondary " />
      </div>
      <div className="flex items-center">
        <i className="mr-4 sm:hidden flex ">
          <AiOutlineSearch />
        </i>
        <div
          className="userMenu items-center flex cursor-pointer"
          ref={setReferenceElement}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="w-8 h-8 rounded-full bg-slate-400 mr-0.5 "></div>
          <i className="">
            <RiArrowDropDownLine size={30} />
          </i>
        </div>
        {showUserMenu && (
          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className="w-20 h-40 bg-bg-primary mt-2 mr-2 userMenu"
          >
            this is going to show up Popper element
            <div ref={setArrowElement} style={styles.arrow} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
