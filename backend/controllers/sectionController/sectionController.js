const asyncHandler = require("express-async-handler");
const { Section } = require("../../models/sectionModel");

const getSection = asyncHandler(async (req, res) => {});
const updateSection = asyncHandler(async (req, res) => {});
const deleteSection = asyncHandler(async (req, res) => {});
const createSection = asyncHandler(async (req, res) => {
  const postBody = req.body;
  const { sectionName } = postBody;
  if (!sectionName) {
    res.status(403).json({ error: "BAD_REQUEST" });
  }
  const section = new Section
});

module.exports = { getSection, updateSection, deleteSection, createSection };
