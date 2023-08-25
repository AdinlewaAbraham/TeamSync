const asyncHandler = require("express-async-handler");
const { Workspace } = require("../../models/workspaceModel");
const getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  res.status(200).json(workspace);
});
const createWorkspace = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { workspaceName, creatorId, workspaceDescription } = req.body;
  if (!workspaceName || !creatorId) {
    res
      .status(400)
      .json({ error: "did not provide workspace name or creator" });
  }
  try {
    const workspace = await Workspace.create({
      name: workspaceName,
      creator: creatorId,
    });
    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the workspace." });
  }

  // res.status(200).json(workspace);
});
const updateWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  res.status(200).json(workspace);
});
module.exports = { getWorkspace, createWorkspace, updateWorkspace };
