const asyncHandler = require("express-async-handler");
const { Workspace } = require("../../models/workspaceModel");
const { Project } = require("../../models/projectModel");
const { User } = require("../../models/userModel");

const getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id)
    .populate({
      path: "members",
      options: { limit: 5 },
    })
    .populate({
      path: "projects",
      model: Project,
      populate: {
        path: "members.user",
        model: User,
        options: { limit: 3 },
      },
    })
    .exec();
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
    console.log(creatorId);
    const newWorkspace = new Workspace({
      name: workspaceName,
      creator: creatorId,
    });

    const [user, workspace] = await Promise.all([
      User.findById(creatorId),
      newWorkspace.save(),
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.workspaces.push(workspace._id);

    await user.save();
    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the workspace." });
  }
  // add workspace to user workspace array
  // res.status(200).json(workspace);
});
const updateWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  res.status(200).json(workspace);
});
module.exports = { getWorkspace, createWorkspace, updateWorkspace };
