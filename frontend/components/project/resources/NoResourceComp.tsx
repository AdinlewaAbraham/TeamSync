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
    null
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
      className="flex h-[160px] p-2 px- border border-border-default 
    rounded-lg items-center justify-center "
    >
      <div>
        <Image src={EmptyProjectResourceIMG} alt="" />
      </div>
      <div>
        <p className="text-sm max-w-[320x]">
          Align your team around a shared vision with a project brief and
          supporting resources.
        </p>
        <div className="flex justify-center items-center">
          <Link href={"/project/" + activeProject._id + "/brief"}>
            <div className="px-4 py-2 flex justify-center items-center text-muted-dark">
              <i className="mr-2">
                <IoDocumentTextOutline />
              </i>
              <span className="text-sm "> create project brief</span>
            </div>{" "}
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
            className="addLinkModal p-2 px-4 flex items-center group hover:bg-menuItem-active cursor-pointer"
          >
            <i className="text-muted-dark text-lg mr-2 group-hover:text-[#f5f4f3]">
              <HiOutlineLink />
            </i>
            Add a link
          </div>
          <label
            htmlFor=""
            className="flex items-center cursor-pointer p-2 px-4 relative
                  hover:bg-menuItem-active tracking-tight group"
          >
            <i className="text-muted-dark text-lg mr-2 group-hover:text-[#f5f4f3]">
              <LuFile />
            </i>{" "}
            Attach a file
            <input
              type="file"
              className="opacity-0 h-full w-full cursor-pointer absolute inset-0"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default NoResourceComp;
