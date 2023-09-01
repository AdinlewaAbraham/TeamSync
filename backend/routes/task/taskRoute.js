const express = require("express");
const {
  createTask,
  deleteTask,
  updateTask,
  getTask,
} = require("../../controllers/taskController/taskController");

const router = express();

router.route("/:id").get(getTask).delete(deleteTask).put(updateTask);

router.post("/", createTask);

module.exports = router;
