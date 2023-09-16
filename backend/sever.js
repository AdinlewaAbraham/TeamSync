const express = require("express");
const workspace = require("./routes/workspace/workspaceRoute");
const project = require("./routes/project/projectRoute");
const googleAuth = require("./routes/auth/googleRoute");
const task = require("./routes/task/taskRoute");
const section = require("./routes/section/sectionRoute")
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const authMiddleware = require("./middleware/validateUserTokenHandler");

const MongoDBStore = require("connect-mongodb-session")(session);

require("./auth");

const db = require("./config/dbConnection");
const passport = require("passport");
const { User } = require("./models/userModel");
const app = express();

const store = new MongoDBStore({
  uri: process.env.CONNECTION_STRING,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
// protected
app.use("/workspace", authMiddleware, workspace);
// protected
app.use("/project", authMiddleware, project);
app.use("/task", authMiddleware, task);
app.use("/section", authMiddleware, section);

// login route for google
app.use("/auth/google/", googleAuth);

app.get("/user", authMiddleware, async (req, res) => {
  const authUser = req.user;
  const user = await User.findById(authUser.id).populate("workspaces").exec();
  res.status(200).json(user);
});

app.get("/auth/failure", (req, res) => {
  res.send("something went wrong");
});
app.get("/login", (req, res) => {
  res.status(200).json({ message: "first fullstack api call" });
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(port, () => {});

// io = require("socket.io")(app, {
//   cors: {
//     origin: "*",
//   },
// });

// io.on("connection", (socket)=>{
//   console.log("connected")
// })

module.exports = { db };
