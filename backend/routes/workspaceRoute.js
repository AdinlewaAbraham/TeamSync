const express = require("express");
const { Workspace } = require("../models/workspaceModel");

const route = express();

route.get("/:id", async (req, res) => {
  try {
    const newWorkspace = await Workspace.create({
      name: "somethign",
      description: "ibeurver",
      members: ["me", "you", "someone else"],
      projects: ["front end project", "back end project"],
    });
    res.status(200).json({ newWorkspace });
  } catch (err) {
    res.send(500).send(err);
  }
});

module.exports = route;
