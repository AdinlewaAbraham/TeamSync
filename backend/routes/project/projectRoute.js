const express = require("express");
const {
  createProject,
  deleteProject,
  editProject,
  getProject,
  updateProjectDescription,
} = require("../../controllers/projectController/projectController");
const router = express();

router.route("/:id").get(getProject).delete(deleteProject);

router.post("/", createProject);
router.put("/updateprojectdescription", updateProjectDescription);

module.exports = router;
