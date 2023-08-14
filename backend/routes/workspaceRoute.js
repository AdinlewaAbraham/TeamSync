const express = require("express");
const { Workspace } = require("../models/workspaceModel");

const {getWorkspace} = require("../controllers/workspaceControllers/workspaceController")

const router = express();

router.route("/:id").get(getWorkspace).post().delete

module.exports = router;
