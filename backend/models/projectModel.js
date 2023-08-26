const mongoose = require("mongoose");

/**
 * @typedef {string} Project
 * @property {string} projectName
 * @property {mongoose.Schema.Types.Date} dueDate
 * @property {string} description
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
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "list",
    },
  ],
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workspace",
    required: [true, "workspace project belongs to required"]
  }
});

const Project = mongoose.model("project", projectSchema);

module.exports = { Project, projectSchema };
