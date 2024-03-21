const jwt = require("jsonwebtoken");
const { User } = require("../../models/userModel");
const { Workspace } = require("../../models/workspaceModel");
const { OAuth2Client } = require("google-auth-library");

const clientId = process.env.CLIENT_ID;
const client = new OAuth2Client(clientId);

const serializeUser = (user) => {
  return {
    ...user,
    _id: user._id.toString(),
    workspaces: user.workspaces.map((workspace) => workspace.toString()),
    activeWorkspaceId: user.activeWorkspaceId.toString(),
  };
};
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: "include token" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      const newUser = new User({
        userName: payload.name,
        userDisplayImage: payload.picture,
        email: payload.email,
        name: payload.given_name,
        activeWorkspaceId: "placeholderId",
        workspaces: ["placeholderId"],
      });
      const workspace = new Workspace({
        name: "my workspace",
        creator: newUser._id,
        admins: [newUser._id],
        members: [newUser._id],
      });
      const createdWorkspace = await workspace.save();
      newUser.workspaces = [createdWorkspace.id];
      newUser.activeWorkspaceId = createdWorkspace.id;
      user = await newUser.save();
    }
    req.user = user;

    const serializedUser = serializeUser(user);

    const accessToken = jwt.sign(
      serializedUser,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      }
    );

    const refreshToken = jwt.sign(
      serializedUser,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const tokens = {
      access: accessToken,
      refresh: refreshToken,
    };

    res.status(200).json({ user, tokens });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "There was a problem processing your request." });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._doc?._id);
    if (!user) {
      return res.status(404).send("cannot find user.");
    }
    const serializedUser = serializeUser(user);
    const accessToken = jwt.sign(
      serializedUser,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
};

module.exports = { refreshToken, googleLogin };
