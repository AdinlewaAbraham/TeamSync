import socket from "@/config/WebSocketManager";
import { useGlobalContext } from "@/context/GeneralContext";
import Project from "@/interfaces/project";
import Section from "@/interfaces/section";
import Task from "@/interfaces/task";
import { useEffect } from "react";

const useTrackProject = (
  paramProjectId: string,
  project: Project | null,
  setProject: (c: Project | null) => void,
) => {
  const { setActiveWorkspace, activeWorkspace } = useGlobalContext();
  useEffect(() => {
    if (project?._id !== paramProjectId && project) {
      setProject(null);
    }
    if (project) {
      // join websocket project room
      socket.emit("join_room", `project_${paramProjectId}`);

      // project controllers
      const handleProjectUpdated = (updatedProject: Project) => {
        console.log("i have received project update");
        console.log(updatedProject);
        setProject({
          ...updatedProject,
          sections: project.sections,
          members: project.members,
        });
      };

      const handleProjectAdded = (project: Project) => {};

      const handleProjectDeleted = (projectId: string) => {
        if (projectId === project._id) {
        }
      };

      // section controllers
      const handleSectionAdded = (section: Section) => {
        const newProject = {
          ...project,
          sections: [...project.sections, section],
        };
        setProject(newProject);
      };

      const handleSectionUpdated = (section: Section) => {
        const newSections: (Section | string)[] = project.sections.map(
          (_section) => {
            if (typeof _section !== "object" || _section._id !== section._id) {
              return _section;
            }
            return { ...section, tasks: _section.tasks };
          },
        );
        const newProject: Project = { ...project, sections: newSections };
        setProject(newProject);
      };

      const handleSectionDeleted = (sectionId: string) => {
        const filteredSections = project.sections.filter(
          (section) => typeof section === "object" && section._id !== sectionId,
        );
        const newProject = {
          ...project,
          sections: filteredSections,
        };
        setProject(newProject);
      };

      // task controllers
      const handleTaskAdded = (task: Task) => {
        console.log("this is my function");
        const deepProjectCopy: Project = JSON.parse(JSON.stringify(project));
        const NewSections = deepProjectCopy.sections.map((section) => {
          if (typeof section === "string" || section._id !== task.sectionId) {
            return section;
          }
          return { ...section, tasks: [...section.tasks, task] };
        }) as Section[];
        // localStorage.removeItem("localTaskPositionObject");
        setProject({ ...deepProjectCopy, sections: NewSections });
      };

      const handleTaskUpdated = (task: Task) => {
        const updatedSections = project.sections.map((section) => {
          if (typeof section === "string" || section._id !== task.sectionId) {
            return section as Section;
          }

          const updatedTasks = section.tasks.map((_task) =>
            typeof _task !== "object" || _task._id !== task._id ? _task : task,
          );

          return { ...section, tasks: updatedTasks } as Section;
        });

        setProject({ ...project, sections: updatedSections });
      };

      const handleTaskDeleted = (
        taskId: string,
        sectionId: string,
        taskRowNumber: number,
      ) => {
        const deepProjectCopy: Project = JSON.parse(JSON.stringify(project));
        const newSections: (Section | string)[] = deepProjectCopy.sections.map(
          (section) => {
            if (typeof section !== "object" || section._id !== sectionId) {
              return section;
            }
            const newTasks = [];
            for (let i = 0; i < section.tasks.length; i++) {
              const currentTask = section.tasks[i];
              if (
                typeof currentTask !== "string" &&
                currentTask._id !== taskId
              ) {
                if (currentTask.rowNumber > taskRowNumber) {
                  newTasks.push({
                    ...currentTask,
                    rowNumber: currentTask.rowNumber - 1,
                  });
                } else {
                  newTasks.push(currentTask);
                }
              }
            }

            const newSection: Section = { ...section, tasks: newTasks };
            return newSection;
          },
        );
        const newProject: Project = {
          ...deepProjectCopy,
          sections: newSections,
        };
        // localStorage.removeItem("localTaskPositionObject");
        setProject(newProject);
      };

      // add project event
      socket.on("project_updated", handleProjectUpdated);
      socket.on("project_deleted", handleProjectDeleted);

      // add section event
      socket.on("section_added", handleSectionAdded);
      socket.on("section_updated", handleSectionUpdated);
      socket.on("section_deleted", handleSectionDeleted);

      // add task event
      socket.on("task_added", handleTaskAdded);
      socket.on("task_updated", handleTaskUpdated);
      socket.on("task_deleted", handleTaskDeleted);

      return () => {
        // remove project event
        socket.off("project_updated", handleProjectUpdated);
        socket.off("project_deleted", handleProjectDeleted);

        // remove section event
        socket.off("section_added", handleSectionAdded);
        socket.off("section_updated", handleSectionUpdated);
        socket.off("section_deleted", handleSectionDeleted);

        // remove task event
        socket.off("task_added", handleTaskAdded);
        socket.off("task_updated", handleTaskUpdated);
        socket.off("task_deleted", handleTaskDeleted);
      };
    }
  }, [project, paramProjectId]);
};

export default useTrackProject;
