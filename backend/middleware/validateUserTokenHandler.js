const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "REDIRECT_TO_LOGIN" });
      }

      const cleaned = { ...decoded, id: decoded._id };
      delete cleaned._id;
      delete cleaned.exp;
      delete cleaned.iat;
      delete cleaned.updatedAt;
      delete cleaned.createdAt;
      delete cleaned.__v;

      req.user = {
        ...cleaned,
      };

      next();
    });
  } else {
    next();
    console.log("failed to verify token");
    return res.status(401).json({ error: "REDIRECT_TO_LOGIN" });
  }
});

module.exports = validateToken;
