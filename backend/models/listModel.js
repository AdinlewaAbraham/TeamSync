const mongoose = require("mongoose");

/**
 * @typedef {Object} List
 * @property {string} listName
 * @property {[mongoose.Schema.Types.ObjectId]} tasks
 * @property {mongoose.Schema.Types.ObjectId} projectId
 *
 */

/**
 * @type {import("mongoose").Model<List>}
 */

const listSchema = mongoose.Schema({
  listName: { type: String, required: [true, "provide list name"] },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
    },
  ],
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "need the projectid this list belongs to"],
  },
});

const List = mongoose.model("list", listSchema);

module.exports = { listSchema, List };
