const express = require("express");
const {
  createProject,
  deleteProject,
  editProject,
} = require("../../controllers/projectController/projectController");
const router = express();

router.route("/:id").get().delete();

router.post("/", createProject);

module.exports = router;
