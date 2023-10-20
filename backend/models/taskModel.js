const mongoose = require("mongoose");

/**
 * @typedef {Object} Task
 * @property {string} taskName
 * @property {string} description
 * @property {[ mongoose.Schema.Types.ObjectId]} assignees
 *
 * @property {mongoose.Schema.Types.Date} dueDate
 * @property {string} Priority
 * @property {string} status
 *
 * @property {[ mongoose.Schema.Types.ObjectId]} comments
 * @property {[ mongoose.Schema.Types.ObjectId]} subTasks
 * @property {[ mongoose.Schema.Types.ObjectId]} members
 *
 * @property { mongoose.Schema.Types.ObjectId} projectId
 * @property {Boolean} isComplete
 */

/**
 * @type {import("mongoose").Model<Task>}
 */

const taskSchema = mongoose.Schema({
  taskName: {
    type: String,
    required: [true, "task name required"],
  },
  description: {
    type: String,
    required: [false],
  },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  dateToStart: {
    type: mongoose.Schema.Types.Date,
  },
  dueDate: {
    type: mongoose.Schema.Types.Date,
  },
  Priority: {
    type: String,
    default: "null",
    required: [false],
  },
  status: {
    type: String,
    default: "null",
    required: [false],
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "need the projectid this task belong to"],
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "need the sectionId this task belong to"],
  },
  isComplete: {
    type: Boolean,
    required: [false],
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: new Date,
  },
  rowNumber: {
    type: Number,
    required: [false],
  }
});

const Task = mongoose.model("task", taskSchema);

module.exports = { Task, taskSchema };
