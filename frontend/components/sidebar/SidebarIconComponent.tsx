import { motion } from "framer-motion";
import React, { MouseEventHandler, useState } from "react";
import { usePopper } from "react-popper";

const SidebarIconComponent = ({
  icon,
  toolTipText,
}: {
  icon: React.ReactNode;
  toolTipText: string;
}) => {
  const [showToolTip, setShowToolTip] = useState(false);

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });
  return (
    <div className="group">
      <div
        ref={setReferenceElement}
        onMouseEnter={() => setShowToolTip(true)}
        onMouseLeave={() => setShowToolTip(false)}
        className="flex justify-center rounded-lg p-1.5 hover:bg-menuItem-hover"
      >
        {icon}
      </div>
      {showToolTip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={
            showToolTip ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
          }
          transition={{ duration: 0, delay: 0.5 }}
          className="whitespace-nowrap rounded-lg bg-menuItem-active p-2 text-xs"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {toolTipText}
        </motion.div>
      )}
    </div>
  );
};

export default SidebarIconComponent;
