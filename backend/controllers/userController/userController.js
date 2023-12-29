const asyncHandler = require("express-async-handler");
const { User } = require("../../models/userModel");
const { PrivateNote } = require("../../models/privateNote");
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

module.exports = { getUser, updateUser, getPrivateNote, updatePrivateNote };
