import { motion } from "framer-motion";
import React, { MouseEventHandler, useState } from "react";

const SidebarIconComponent = ({
  icon,
  toolTipText,
}: {
  icon: React.ReactNode;
  toolTipText: string;
}) => {
  const [showToolTip, setShowToolTip] = useState(false);
  return (
    <div
      className="p-1.5 hover:bg-menuItem-hover relative flex justify-center rounded-lg"
      onMouseEnter={() => setShowToolTip(true)}
      onMouseLeave={() => setShowToolTip(false)}
    >
      {showToolTip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={
            showToolTip ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
          }
          transition={{ duration: 0, delay: 0.5 }}
          className="text-xs p-2 bg-menuItem-active absolute top-[-40px] whitespace-nowrap rounded-lg"
        >
          {toolTipText}
        </motion.div>
      )}
      <div>{icon}</div>
    </div>
  );
};

export default SidebarIconComponent;
