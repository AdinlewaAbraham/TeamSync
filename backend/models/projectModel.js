const mongoose = require("mongoose");

/**
 * @typedef {string} Project
 * @property {string} projectName
 * @property {mongoose.Schema.Types.Date} dueDate
 * @property {string} description
 * @property {[ mongoose.Schema.Types.ObjectId]} sections
 * @property {[ mongoose.Schema.Types.ObjectId]} workspaceId
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
  isProjectPrivate: { type: Boolean, default: false },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      role: {
        type: String,
        enum: ["manager", "creator", "member"],
        default: "member",
      },
    },
  ],
  projectBrief: {
    type: Object,
    required: [false],
  },
  projectResources: {
    type: Array,
    required: [false],
  },
  projectStatus: {
    type: String,
    required: [false],
  },
  projectDueDate: {
    type: mongoose.Schema.Types.Date,
    required: [false],
  },
  sections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
    },
  ],
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workspace",
    required: [true, "workspace project belongs to required"],
  },
});

const Project = mongoose.model("project", projectSchema);

module.exports = { Project, projectSchema };
