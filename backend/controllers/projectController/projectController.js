const asyncHandler = require("express-async-handler");
const { Project } = require("../../models/projectModel");
const { Workspace } = require("../../models/workspaceModel");
const { List } = require("../../models/listModel");
const { Task } = require("../../models/taskModel");

const editProject = asyncHandler((req, res) => {});

const createProject = asyncHandler(async (req, res) => {
  const { projectName, projectDescription, workspaceId } = req.body;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    return res.status(404).json({ error: "Workspace not found" });
  }

  const newProject = new Project({
    projectName: projectName,
    description: projectDescription,
    workspaceId,
  });

  workspace.projects.push(newProject._id);

  try {
    const [savedProject, savedWorkspace] = await Promise.all([
      newProject.save(),
      workspace.save(),
    ]);

    res.status(200).json(savedProject);
  } catch (error) {
    res.status(500).json({ error: "Error creating project" });
  }
});
const getProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId)
    .populate({
      path: "lists",
      model: List, // Specify the List model
      populate: {
        path: "tasks",
        model: Task, // Adjust the task model name if needed
      },
    })
    .exec();
  console.log(project);
  if (project) {
    res.status(200).json(project);
  } else {
    res.status(404).json({ error: "PROJECT_NOT_FOUND" });
  }
});

const deleteProject = asyncHandler((req, res) => {});
module.exports = { createProject, deleteProject, editProject, getProject };
