const express = require("express");
const mongoose = require("mongoose");
const workspace = require("./routes/workspaceRoute");
require("dotenv").config();

const app = express();

const url = "mongodb://localhost:27017/mydatabase";
// const dbName = "mydatabase";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connnected successfully"))
  .catch((err) => console.log("could not connect mongodb " + err));
const port = process.env.PORT || 5000;

app.use("/api", workspace);

app.listen(port, () => {});
