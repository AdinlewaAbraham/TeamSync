const asyncHandler = require("express-async-handler");
const { Section } = require("../../models/sectionModel");
const { Project } = require("../../models/projectModel");
const { sendMessage } = require("../../utils/socket-io");
const { Task } = require("../../models/taskModel");

const getSection = asyncHandler(async (req, res) => {});
const updateSection = asyncHandler(async (req, res) => {
  try {
    const sectionId = req.params.id;
    const updateObject = req.body;

    console.log(updateObject);
    
    const section = await Section.findById(sectionId);
    if (section) {
      for (key in updateObject) {
        section[key] = updateObject[key];
      }

      await section.save();
      // await Project.updateOne(filter, );
    } else {
      res.status(404);
    }
    console.log(section);
    sendMessage(`project_${section.projectId}`, "section_updated", [section]);
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
const deleteSection = asyncHandler(async (req, res) => {
  const sectionID = req.params.sectionId;
  const projectId = req.params.projectId;
  console.log(sectionID);
  console.log(projectId);

  if (!sectionID || !projectId) {
    res.status(400).json({ message: "bad request" });

    console.log("Bad request");
  } else {
    try {
      const section = await Section.findById(sectionID);
      if (section) {
        const sectionTasks = section.tasks;
        const result = await Task.deleteMany({ _id: { $in: sectionTasks } });
        console.log(result.deletedCount);
        await Section.findByIdAndRemove(sectionID);
        const project = await Project.findById(projectId);

        await project.updateOne({
          $pull: {
            sections: sectionID,
          },
        });
        sendMessage(`project_${projectId}`, "section_deleted", [sectionID]);
        res.status(200).json({ message: "Section deleted successfully" });
        console.log("Document deleted successfully");
      }
    } catch (error) {
      res.status(500).json({ message: "something went wrong" });
      console.error("Error deleting document:", error);
    }
  }
});
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
  if (!project.sections) {
    project.sections = [];
  }
  console.log(project);
  sendMessage(`project_${projectId}`, "section_added", [section]);
  await Promise.all([
    await section.save(),
    await project.updateOne({
      $push: {
        sections: section.id,
      },
    }),
  ]);
  res.status(200).json(section);
});

module.exports = { getSection, updateSection, deleteSection, createSection };
