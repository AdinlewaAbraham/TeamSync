import { useGlobalContext } from "@/context/GeneralContext";
import React from "react";

const ProjectMainSection = () => {
  const { activeWorkspace } = useGlobalContext();
  const projects = activeWorkspace?.projects;

  return (
    <div>
      {projects ? (
        <>
          {projects.length === 0 ? (
            <>no projects create one</>
          ) : (
            <>
              {projects.map((project) => (
                <>{project}</>
              ))}
            </>
          )}
        </>
      ) : (
        <>loading</>
      )}
    </div>
  );
};

export default ProjectMainSection;
