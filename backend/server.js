const express = require("express");
const workspace = require("./routes/workspace/workspaceRoute");
const auth = require("./routes/auth/auth");
const project = require("./routes/project/projectRoute");
const task = require("./routes/task/taskRoute");
const section = require("./routes/section/sectionRoute");
const user = require("./routes/user/UserRoute");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const authMiddleware = require("./middleware/validateUserTokenHandler");
const { socketConnection } = require("./utils/socket-io");
const { sendMessage } = require("./utils/socket-io");

const MongoDBStore = require("connect-mongodb-session")(session);

const port = process.env.PORT || 5000;
const db = require("./config/dbConnection");
const passport = require("passport");
const { User } = require("./models/userModel");
const app = express();

const server = require("http").createServer(app);
socketConnection(server);

server.listen(port);

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
const corsOptions = {
  origin: "http://yourfrontenddomain.com",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
// protected
app.use("/workspace", authMiddleware, workspace);
// protected
app.use("/project", authMiddleware, project);
app.use("/task", authMiddleware, task);
app.use("/section", authMiddleware, section);

// login route for google
app.use("/auth", auth);

app.use("/user", authMiddleware, user);

app.get("/login", (req, res) => {
  const roomId = "12345";
  const key = "eventName";
  const message = "new order assigned";

  sendMessage(roomId, key, message);
  res.status(200).json({ message: "cringe" });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "John Lennon was the best thing to happen to the Beatles.",
  });
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = { db };
