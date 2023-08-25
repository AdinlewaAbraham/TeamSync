const mongoose = require("mongoose");

/**
 * @typedef {string} Project
 * @property {string} projectName
 * @property {mongoose.Schema.Types.Date} dueDate
 * @property {string} description
 *
 * @property {[ mongoose.Schema.Types.ObjectId]} members
 * @property {[ mongoose.Schema.Types.ObjectId]} lists
 *
 */

/**
 * @type {import("mongoose").Model<Project>}
 */

const projectSchema = mongoose.Schema({
  projectName: { type: String, required: [true, "provide project name"] },
  dueDate: {
    type: mongoose.Schema.Types.Date,
    required: [false],
  },
  description: {
    type: String,
    required: [false],
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "list",
    },
  ],
});

const Project = mongoose.model("project", projectSchema);

module.exports = { Project, projectSchema };