const asyncHandler = require("express-async-handler");
const { Task } = require("../../models/taskModel");
const { Section } = require("../../models/sectionModel");
const { Project } = require("../../models/projectModel");
const { sendMessage } = require("../../utils/socket-io");
const { findMinFreeRowNumber } = require("../../utils/findMinFreeRowNumber");

const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: "no task found" });
  }
  res.status(200).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const reqBody = await req.body;
  const taskId = req.params.id;
  try {
    const update = {
      $set: reqBody,
    };
    const task = await Task.findById(taskId);
    if (reqBody && task) {
      await task.updateOne(update);
      await task.save();
      sendMessage(`project_${task.projectId}`, "task_updated", [task]);
      res.status(200).json(task);
    } else {
      res.status(400);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

const createTask = asyncHandler(async (req, res) => {
  const {
    taskName,
    projectId,
    sectionId,
    dueDate,
    dateToStart,
    currentRowNumber,
  } = await req.body;

  if (!taskName || !projectId) {
    console.log("bad request");
    console.log(taskName, projectId, sectionId, dateToStart, dueDate);
    return res.status(403).json({ message: "bad request" });
  }

  console.log(taskName, projectId, sectionId, dateToStart, dueDate);

  const taskQuery = {
    $and: [
      { dateToStart: { $exists: true } },
      { dueDate: { $exists: true } },
      { sectionId },
    ],
  };

  const taskProjection = { dateToStart: 1, dueDate: 1, rowNumber: 1 };

  const [project, tasksInSection] = await Promise.all([
    Project.findById(projectId),
    sectionId ? Task.find(taskQuery, taskProjection) : [],
  ]);

  const rowNumber = findMinFreeRowNumber(
    tasksInSection,
    dateToStart,
    dueDate,
    currentRowNumber ? currentRowNumber : 0
  );

  console.log(rowNumber);

  const task = new Task({
    taskName: taskName,
    projectId: projectId,
    sectionId: sectionId || project.sections[0],
    dateToStart: dateToStart,
    dueDate: dueDate,
    rowNumber: rowNumber,
  });
  const section = await Section.findById(sectionId);
  if (!section) {
    return res.status(404).send("section not found");
  }
  section.tasks.push(task.id);
  try {
    await Promise.all([task.save(), section.save()]);
    sendMessage(`project_${projectId}`, "task_added", [task]);
    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "got this error" + error });
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  console.log(taskId);
  try {
    const task = await Task.findById(taskId);
    if (task) {
      const sectionId = task.sectionId;
      await Section.findOneAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            tasks: taskId,
          },
        }
      );

      const taskRowNumber = task.rowNumber;
      await Task.updateMany(
        { sectionId, rowNumber: { $gt: taskRowNumber } },
        { $inc: { rowNumber: -1 } }
      );

      await Task.deleteOne({ _id: taskId });

      sendMessage(`project_${task.projectId}`, "task_deleted", [
        taskId,
        sectionId,
        taskRowNumber,
      ]);
      res.status(200);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "got this error" + error });
  }
});

module.exports = { getTask, deleteTask, createTask, updateTask };
