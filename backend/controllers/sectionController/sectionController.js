const asyncHandler = require("express-async-handler");
const { Section } = require("../../models/sectionModel");
const { Project } = require("../../models/projectModel");

const getSection = asyncHandler(async (req, res) => {});
const updateSection = asyncHandler(async (req, res) => {});
const deleteSection = asyncHandler(async (req, res) => {});
const createSection = asyncHandler(async (req, res) => {
  const postBody = req.body;
  const { sectionName, projectId } = postBody;
  if (!sectionName || !projectId) {
    res.status(403).json({ error: "BAD_REQUEST" });
  }

  const section = new Section({
    sectionName: sectionName,
    projectId: projectId,
  });

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  project.sections.push(section.id);
  await Promise.all([section.save(), project.save()]);
  res.status(200).json(section);
});

module.exports = { getSection, updateSection, deleteSection, createSection };
