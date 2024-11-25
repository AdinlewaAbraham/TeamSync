import { useEffect } from "react";
import socket from "@/config/WebSocketManager";
import { useGlobalContext } from "@/context/GeneralContext";
import Project from "@/interfaces/project";
import Section from "@/interfaces/section";
import Task from "@/interfaces/task";

const useTrackProject = (
  paramProjectId: string,
  project: Project | null,
  setProject: (project: Project | null) => void
) => {
  const { setActiveWorkspace } = useGlobalContext();
 
  const updateProjectState = (updatedProject: Partial<Project>) => {
    if (!project) return;
    setProject({ ...project, ...updatedProject });
  };
 
  const handleProjectUpdated = (updatedProject: Project) => {
    console.debug("Project updated", updatedProject);
    updateProjectState({
      ...updatedProject,
      sections: project.sections,
      members: project.members,
    });
  };

  const handleProjectDeleted = (projectId: string) => {
    if (projectId === project?._id) {
      console.warn(`Project ${projectId} was deleted`);
      setProject(null);
    }
  };

  const handleSectionAdded = (section: Section) => {
    console.debug("Section added", section);
    updateProjectState({ sections: [...(project?.sections || []), section] });
  };

  const handleSectionUpdated = (updatedSection: Section) => {
    const updatedSections = project?.sections.map((section) =>
      typeof section === "object" && section._id === updatedSection._id
        ? { ...updatedSection, tasks: section.tasks }
        : section
    );
    updateProjectState({ sections: updatedSections });
  };

  const handleSectionDeleted = (sectionId: string) => {
    const filteredSections = project?.sections.filter(
      (section) => typeof section !== "object" || section._id !== sectionId
    );
    updateProjectState({ sections: filteredSections });
  };

  const handleTaskAdded = (task: Task) => {
    console.debug("Task added", task);
    const updatedSections = project?.sections.map((section) =>
      typeof section === "object" && section._id === task.sectionId
        ? { ...section, tasks: [...section.tasks, task] }
        : section
    );
    updateProjectState({ sections: updatedSections });
  };

  const handleTaskUpdated = (task: Task) => {
    const updatedSections = project?.sections.map((section) => {
      if (typeof section !== "object" || section._id !== task.sectionId) return section;
      const updatedTasks = section.tasks.map((t) =>
        typeof t === "object" && t._id === task._id ? task : t
      );
      return { ...section, tasks: updatedTasks };
    });
    updateProjectState({ sections: updatedSections });
  };

  const handleTaskDeleted = (taskId: string, sectionId: string, taskRowNumber: number) => {
    const updatedSections = project?.sections.map((section) => {
      if (typeof section !== "object" || section._id !== sectionId) return section;
      const filteredTasks = section.tasks
        .filter((task) => typeof task === "object" && task._id !== taskId)
        .map((task) =>
          typeof task === "object" && task.rowNumber > taskRowNumber
            ? { ...task, rowNumber: task.rowNumber - 1 }
            : task
        );
      return { ...section, tasks: filteredTasks };
    });
    updateProjectState({ sections: updatedSections });
  };

  useEffect(() => {
    if (!paramProjectId || project?._id === paramProjectId) return;

    if (project) {
      setProject(null);
    }

    // Join project room
    socket.emit("join_room", `project_${paramProjectId}`);
    console.info(`Joined room project_${paramProjectId}`);

    // Register socket event listeners
    const eventHandlers = [
      ["project_updated", handleProjectUpdated],
      ["project_deleted", handleProjectDeleted],
      ["section_added", handleSectionAdded],
      ["section_updated", handleSectionUpdated],
      ["section_deleted", handleSectionDeleted],
      ["task_added", handleTaskAdded],
      ["task_updated", handleTaskUpdated],
      ["task_deleted", handleTaskDeleted],
    ];

    eventHandlers.forEach(([event, handler]) => {
      socket.on(event, handler as (...args: any[]) => void);
    });
 
    return () => {
      eventHandlers.forEach(([event, handler]) => {
        socket.removeListener(event, handler as (...args: any[]) => void);
      });
      console.info(`Left room project_${paramProjectId}`);
    };
  }, [paramProjectId, project]);

  return { activeWorkspace }; 
};

export default useTrackProject;
