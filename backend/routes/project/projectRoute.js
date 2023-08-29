const express = require("express");
const {
  createProject,
  deleteProject,
  editProject,
  getProject,
} = require("../../controllers/projectController/projectController");
const router = express();

router.route("/:id").get(getProject).delete(deleteProject);

router.post("/", createProject);

module.exports = router;
