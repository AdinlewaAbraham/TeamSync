const asyncHandler = require("express-async-handler");
const { User } = require("../../models/userModel");
const { PrivateNote } = require("../../models/privateNote");
const { Project } = require("../../models/projectModel");
const { db } = require("../../server");
const { Section } = require("../../models/sectionModel");
const getUser = asyncHandler(async (req, res) => {
  const authUser = req.user;
  const user = await User.findById(authUser.id).populate("workspaces").exec();
  res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  console.log("reqBody");
  const authUser = req.user;
  const reqBody = req.body;
  if (reqBody?.field && reqBody?.privateNote) {
    await User.findByIdAndUpdate(authUser.id, {
      [reqBody?.field]: reqBody?.privateNote,
    });
    res.status(200).json(reqBody.privateNote);
  } else {
    res.sendStatus(400);
  }
});

const getPrivateNote = asyncHandler(async (req, res) => {
  const authUser = req.user;

  const privateNote = await PrivateNote.findById(authUser.id);
  if (!privateNote) {
    // create private note
    const newPrivateNote = PrivateNote;

    res.status(200).json(privateNote);
  } else {
    res.status(200).json(privateNote);
  }
});

const updatePrivateNote = asyncHandler(async (req, res) => {
  const authUser = req.user;
  const reqBody = req.body;

  if (reqBody?.privateNote) {
    // update private note
  }
  res.status(200).json({});
});

const getUserProject = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      res.status(401);
    }
    const project = await Project.findById(userId);
    if (!project) {
      const finishedection = new Section({
        sectionName: "Finished",
        projectId: userId,
      });
      const doneSection = new Section({
        sectionName: "In Progress",
        projectId: userId,
      });
      const Section = new Section({
        sectionName: "Upcoming",
        projectId: userId,
      });
      const userProject = {
        _id: userId,
        name: "personal project",
        sections: [],
      };

      db.projects.insertOne(userProject);
    } else {
      res.status(200).json(project);
    }
  } catch {
    console.log(error);
    res.status(500);
  }
});

module.exports = { getUser, updateUser, getPrivateNote, updatePrivateNote };
