import { useGlobalContext } from "@/context/GeneralContext";
import { useEffect, useState } from "react";
import { CiLogin } from "react-icons/ci";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { IoCheckmark, IoLogOutOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { usePopper } from "react-popper";

export const MemberRoleSwitch = ({
  role,
  memberId,
}: {
  role: string;
  memberId: string;
}) => {
  const [showSelectRoleModal, setShowSelectRoleModal] = useState(false);
  const { user } = useGlobalContext();

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
      if (!target.closest(".selectRoleModal")) {
        setShowSelectRoleModal(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div>
      {showSelectRoleModal && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="selectRoleModal rounded-lg border border-border-default bg-bg-secondary"
        >
          <div className="max-w-[280px]">
            {user?._id === memberId ? (
              <ul className="py-1">
                <li className="cursor-pointer px-2.5 py-1.5 text-red-400 hover:bg-menuItem-active">
                  <div className="grid grid-cols-8 items-center justify-center gap-2 ">
                    <div className="col-span-1 text-xl flex items-center justify-center">
                      <TbLogout/>
                    </div>
                    <div className="col-span-7">Leave project</div>
                  </div>
                </li>
              </ul>
            ) : (
              <ul className="py-1">
                {[
                  {
                    header: "Project manager",
                    description:
                      "you are master more more more more gimme more",
                    objKey: "admin",
                  },
                  {
                    header: "Content creator",
                    description: "you are editor",
                    objKey: "editor",
                  },
                  {
                    header: "Team member",
                    description: "you are com",
                    objKey: "",
                  },
                ].map((roleObj) => (
                  <li
                    key={roleObj.objKey}
                    className="cursor-pointer px-2.5 py-1.5 hover:bg-menuItem-active"
                  >
                    <div className="grid grid-cols-8 gap-2">
                      <div className="col-span-1 flex justify-center pt-1.5 text-muted-dark">
                        {role === roleObj.objKey && <IoCheckmark />}
                      </div>
                      <div className="col-span-7">
                        <header className="pb-1">{roleObj.header}</header>
                        <p className="text-xs text-muted-dark">
                          {roleObj.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <div
        className={` selectRoleModal flex cursor-pointer items-center rounded-lg p-2
         text-xs text-muted-dark`}
        onClick={() => setShowSelectRoleModal(!showSelectRoleModal)}
        ref={setReferenceElement}
      >
        <span className="mr-2">
          {" "}
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
        <i>
          <FaChevronDown />
        </i>
      </div>
    </div>
  );
};
