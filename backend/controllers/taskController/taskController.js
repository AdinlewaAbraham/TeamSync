const asyncHandler = require("express-async-handler");
const { Task } = require("../../models/taskModel");
const { Section } = require("../../models/sectionModel");
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: "no task found" });
  }
  res.status(200).json(task);
});
const updateTask = asyncHandler(async (req, res) => {});

const createTask = asyncHandler(async (req, res) => {
  const { taskName, projectId, sectionId, dueDate } = await req.body;
  if (!taskName || !projectId || !sectionId) {
    res.status(403).json({ message: "bad request" });
  }
  console.log(taskName, projectId, sectionId);
  const task = new Task({
    taskName: taskName,
    projectId: projectId,
    sectionId: sectionId,
    dueDate: dueDate
  });
  const section = await Section.findById(sectionId);
  if (!section) {
    res.status(404).send("section not found");
  }
  section.tasks.push(task.id);
  try {
    await Promise.all([task.save(), section.save()]);
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "got this error" + error });
  }
});

const deleteTask = asyncHandler(async (req, res) => {});

module.exports = { getTask, deleteTask, createTask, updateTask };
