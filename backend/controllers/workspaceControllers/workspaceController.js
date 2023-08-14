const asyncHandler = require("express-async-handler");
const { Workspace } = require("../../models/workspaceModel");
const getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  res.status(200).json(workspace);
});

module.exports = { getWorkspace };
