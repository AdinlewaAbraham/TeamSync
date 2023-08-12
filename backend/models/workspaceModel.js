const mongoose = require("mongoose");

/**
 * @typedef {Object} Workspace
 * @property {string} name
 * @property {string} description
 * @property {Array} members
 * @property {Array} projects
 */

/**
 * @type {import("mongoose").Model<Contact>}
 */

const workspaceShema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a workspace name"],
    },
    description: {
      type: String,
      required: [true, "please provide a description for the workspace"],
    },
    members: {
      type: Array,
      required: [false],
    },
    projects: {
      type: Array,
      required: [false],
    },
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", workspaceShema);

module.exports = { Workspace };
