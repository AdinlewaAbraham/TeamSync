const express = require("express");
const {
  googleLogin,
  refreshToken,
} = require("../../controllers/authController/authController");
const router = express();

router.post("/refresh", refreshToken);

router.post("/google", googleLogin);

module.exports = router;
