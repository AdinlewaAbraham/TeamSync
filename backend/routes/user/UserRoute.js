const router = require("express").Router();
const {
  getUser,
  updateUser,
  getPrivateNote,
  updatePrivateNote,
} = require("../../controllers/userController/userController");

router.route("/").get(getUser).put(updateUser);
router.route("/privatenote").get(getPrivateNote).put(updatePrivateNote);
module.exports = router;
