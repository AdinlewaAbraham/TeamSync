const express = require("express");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send("welcom to another underground spritiual guage");
});

app.listen(port, (req, res) => {});
