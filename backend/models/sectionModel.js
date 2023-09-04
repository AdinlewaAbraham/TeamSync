const mongoose = require("mongoose");

/**
 * @typedef {Object} Section
 * @property {string} sectionName
 * @property {[mongoose.Schema.Types.ObjectId]} tasks
 * @property {mongoose.Schema.Types.ObjectId} projectId
 *
 */

/**
 * @type {import("mongoose").Model<Section>}
 */

const sectionSchema = mongoose.Schema({
  sectionName: { type: String, required: [true, "provide section name"] },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
    },
  ],
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "need the projectid this section belongs to"],
  },
});

const Section = mongoose.model("section", sectionSchema);

module.exports = { sectionSchema, Section };
