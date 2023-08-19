const express = require("express");
const passport = require("passport");



const router = express();
router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/workspace",
    failureRedirect: "/auth/failure",
  })
);

module.exports = router;
