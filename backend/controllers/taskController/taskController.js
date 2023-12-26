const asyncHandler = require("express-async-handler");
const { Task } = require("../../models/taskModel");
const { Section } = require("../../models/sectionModel");
const { sendMessage } = require("../../utils/socket-io");

const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: "no task found" });
  }
  res.status(200).json(task);
});
const updateTask = asyncHandler(async (req, res) => {});

const createTask = asyncHandler(async (req, res) => {
  const { taskName, projectId, sectionId, dueDate, dateToStart, rowNumber } =
    await req.body;
  if (
    !taskName ||
    !projectId ||
    !sectionId ||
    (dueDate && dateToStart && !rowNumber && rowNumber !== 0)
  ) {
    console.log("bad request");
    console.log(
      taskName,
      projectId,
      sectionId,
      dateToStart,
      dueDate,
      rowNumber
    );
    return res.status(403).json({ message: "bad request" });
  }
  console.log(taskName, projectId, sectionId, dateToStart, dueDate);

  const task = new Task({
    taskName: taskName,
    projectId: projectId,
    sectionId: sectionId,
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
    sendMessage(`section_${sectionId}`, "task_added", [task]);
    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "got this error" + error });
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
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
      await task.deleteOne();

      sendMessage(`section_${sectionId}`, "task_deleted", [taskId]);
      res.status(200);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "got this error" + error });
  }
});

module.exports = { getTask, deleteTask, createTask, updateTask };
