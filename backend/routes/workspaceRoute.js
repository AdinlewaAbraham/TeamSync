const express = require("express");
const { Workspace } = require("../models/workspaceModel");

const {getWorkspace} = require("../controllers/workspace/workspace")

const router = express();

router.route("/:id").get(getWorkspace).post().delete

module.exports = router;
