const mongoose = require("mongoose");

/**
 * @typedef {Object} Comment
 * @property {string} text
 * @property {mongoose.Schema.Types.ObjectId} senderId
 *
 * @property {string} senderDisplayName
 * @property {string} senderEmail
 *
 */

/**
 * @type {import("mongoose").Model<Comment>}
 */

const commentSchema = mongoose.Schema({
  text: { type: String, required: [true, "provide comment text"] },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "provide comment text"],
  },
  senderDisplayName: {
    type: String,
    required: [true, "provide comment text"],
  },
  senderEmail: {
    type: String,
    required: [true, "provide comment text"],
  },
  lists: [{
    type: mongoose.Schema.Types.ObjectId, ref: "list"
  }]
});

const Comment = mongoose.model("project", taskSchema);

module.exports = { Comment, commentSchema };
