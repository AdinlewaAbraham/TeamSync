const express = require("express");
const {
  createProject,
  deleteProject,
  getProject,
  updateProject,
} = require("../../controllers/projectController/projectController");
const router = express();

router.route("/:id").get(getProject).delete(deleteProject).put(updateProject);

router.post("/", createProject);

module.exports = router;
