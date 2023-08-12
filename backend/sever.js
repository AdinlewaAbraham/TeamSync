const express = require("express");
const mongoose = require("mongoose");
const workspace = require("./routes/workspaceRoute");
require("dotenv").config();

const db = require("./db")

const app = express();


const port = process.env.PORT || 5000;

app.use("/api", workspace);

app.listen(port, () => {});

module.exports = { db };
