const asyncHandler = require("express-async-handler");
const { Task } = require("../../models/taskModel");
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: "no task found" });
  }
  res.status(200).json(task);
});
const updateTask = asyncHandler(async (req, res) => {});
const createTask = asyncHandler(async (req, res) => {
  const { taskName, projectId } = await req.body;
  if (!taskName || !projectId) {
    res.status(403).json({ message: "bad request" });
  }
  console.log(taskName, projectId);
  const task = new Task({ taskName: taskName, projectId: projectId });
  try {
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "got this error" + error });
  }
  res.status();
});
const deleteTask = asyncHandler(async (req, res) => {});

module.exports = { getTask, deleteTask, createTask, updateTask };
