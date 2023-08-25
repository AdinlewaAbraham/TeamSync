const express = require("express");
const { Workspace } = require("../../models/workspaceModel");

const {
  getWorkspace,
  createWorkspace,
  updateWorkspace,
} = require("../../controllers/workspaceControllers/workspaceController");

const router = express();

router.route("/:id").get(getWorkspace).post().delete;
router.get("/", (req, res) => {
  res.json(req.user).status(200);
});
router.post("/", createWorkspace);

module.exports = router;
