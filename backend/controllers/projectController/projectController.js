const asyncHandler = require("express-async-handler");
const { Project } = require("../../models/projectModel");
const { Workspace } = require("../../models/workspaceModel");

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

const deleteProject = asyncHandler((req, res) => {});
module.exports = { createProject, deleteProject, editProject };
