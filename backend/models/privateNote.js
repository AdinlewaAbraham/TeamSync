const mongoose = require("mongoose");

/**
 * @typedef {string} PrivateNote
 * @property {string} noteContentStateJSON
 *
 */

/**
 * @type {import("mongoose").Model<PrivateNote>}
 */

const privateNoteSchema = mongoose.Schema({
  noteContentStateJSON: {
    type: String,
  },
  userId: {
    type: String,
    required: [true, ""]
  },
});

const PrivateNote = mongoose.model("privatenote", privateNoteSchema);

module.exports = { PrivateNote, privateNoteSchema };
