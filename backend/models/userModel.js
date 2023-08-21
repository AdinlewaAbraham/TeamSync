const mongoose = require("mongoose");

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {string} email
 * @property {Array} workspaces
 */

/**
 * @type {import("mongoose").Model<User>}
 */

const userSchema = mongoose.Schema(
  {
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

    workspaces: {
      type: Array,
      required: [false],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = { User , userSchema};
