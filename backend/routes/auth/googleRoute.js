const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express();
router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/failure",
  })
);

router.get("/success", (req, res) => {
  console.log(req.user);
  const accessToken = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600 * 24,
  });
  res.cookie("userToken", accessToken, { httpOnly: true });
  console.log(accessToken);
  res.redirect("http://localhost:3000/");
});

module.exports = router;
