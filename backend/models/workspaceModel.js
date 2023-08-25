const mongoose = require("mongoose");

/**
 * @typedef {Object} Workspace
 * @property {string} name
 * @property {string} description
 * @property {[mongoose.Schema.Types.ObjectId]} members
 * @property {[mongoose.Schema.Types.ObjectId]} admins
 * @property {mongoose.Schema.Types.ObjectId} creator
 * @property {[mongoose.Schema.Types.ObjectId]} projects
 * @property {[object]} settings
 */

/**
 * @type {import("mongoose").Model<Workspace>}
 */

const workspaceShema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a workspace name"],
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
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "need creator of workspace"],
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "project" }],
    settings: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", workspaceShema);

module.exports = { Workspace };
