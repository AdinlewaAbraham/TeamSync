const mongoose = require("mongoose");

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {string} userName
 * @property {string} userDisplayImage
 * @property {string} email
 * @property {[ mongoose.Schema.Types.ObjectId]} workspaces
 */

/**
 * @type {import("mongoose").Model<User>}
 */

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "whats your name?"],
  },
  userName: {
    type: String,
    required: [true, "whats your username?"],
  },
  userDisplayImage: {
    type: String,
    required: [true, "provide your picture"],
  },
  email: {
    type: String,
    required: [true, "whats your email?"],
  },
  workspaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "needs to be in aleast one workspace"],
    },
  ],
  activeWorkspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: [true, "activeworkspaceId needed"],
  },
});

const User = mongoose.model("user", userSchema);

module.exports = { User, userSchema };
