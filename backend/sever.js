const express = require("express");
const workspace = require("./routes/workspaceRoute");
require("dotenv").config();
const cors = require("cors");

const db = require("./config/dbConnection");
const app = express();

const port = process.env.PORT || 5000;

app.use("/api/workspace", cors(),workspace);
// app.use(cors());

app.listen(port, () => {});

module.exports = { db };
