const mongoose = require("mongoose");
const { commentSchema } = require("./commentModel");

/**
 * @typedef {Object} Task
 * @property {string} taskName
 * @property {string} description
 * @property {Array} assignees
 *
 * @property {Date} dueDate
 * @property {string} Priority
 * @property {string} status
 *
 * @property {Array} comments
 * @property {Array} subTasks
 * @property {Array} collaborators
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
  assignees: {
    type: Array,
    required: [false],
  },
  dueDate: {
    type: Date,
  },
  Priority: {
    type: String,
    required: [true, "task prio required"],
  },
  status: {
    type: String,
    required: [true, "task status required"],
  },
  comments: [commentSchema],
  subTasks:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'task' }],
  collaborators: {
    type: Array,
    required: [false],
  },
  isComplete: {
    type: Boolean,
    required: [false],
  },
});

const Task = mongoose.model("task", taskSchema);

module.exports = { Task };
