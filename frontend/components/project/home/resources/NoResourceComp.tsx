import { useGlobalContext } from "@/context/GeneralContext";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Project from "@/interfaces/project";
import { usePopper } from "react-popper";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GoPaperclip } from "react-icons/go";
import { TbFileUpload } from "react-icons/tb";
import { CiFileOn } from "react-icons/ci";
import { HiOutlineLink } from "react-icons/hi";
import { LuFile } from "react-icons/lu";
import AddLinkModal from "@/components/modals/AddLinkModal";
import EmptyProjectResourceIMG from "@/assects/project/createResources.svg";
import Image from "next/image";

const NoResourceComp = ({
  activeProject,
  showAddLinkModal,
  setShowAddLinkModal,
}: {
  activeProject: Project;
  showAddLinkModal: boolean;
  setShowAddLinkModal: (c: boolean) => void;
}) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (!target.closest(".addLinkModal")) {
        setShowAddLinkModal(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      className="flex h-[160px] gap-2 items-center justify-center rounded-lg 
    border border-border-default p-2 "
    >
      <div>
        <Image src={EmptyProjectResourceIMG} alt="" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="max-w-[450px] text-center text-sm">
          Align your team around a shared vision with a project brief and
          supporting resources.
        </p>
        <div className="flex items-center justify-center">
          <Link href={"/project/" + activeProject._id + "/brief"}>
            <div className="flex items-center justify-center px-4 py-2 text-muted-dark">
              <i className="mr-2">
                <IoDocumentTextOutline />
              </i>
              <span className="text-sm "> create project brief</span>
            </div>
          </Link>
          {showAddLinkModal && (
            <div
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              className=""
            >
              <AddLinkModal />
            </div>
          )}
          <div
            ref={setReferenceElement}
            onClick={() => setShowAddLinkModal(!showAddLinkModal)}
            className="addLinkModal group flex cursor-pointer items-center p-2 px-4 text-sm  text-muted-dark hover:bg-menuItem-active"
          >
            <i className="mr-2 text-lg text-muted-dark group-hover:text-[#f5f4f3]">
              <HiOutlineLink />
            </i>
            <span> Add a link</span>
          </div>
          <label
            htmlFor=""
            className="group relative flex cursor-pointer items-center p-2
                  px-4 text-sm tracking-tight text-muted-dark hover:bg-menuItem-active"
          >
            <i className="mr-2 text-lg text-muted-dark group-hover:text-[#f5f4f3]">
              <LuFile />
            </i>
            <span>Attach a file</span>
            <input
              type="file"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default NoResourceComp;
