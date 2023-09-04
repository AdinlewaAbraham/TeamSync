const express = require("express");

const {
  createSection,
  deleteSection,
  getSection,
  updateSection,
} = require("../../controllers/sectionController/sectionController");

const router = express();

router.route("/:id").delete(deleteSection).get(getSection).put(updateSection);
router.route("/").post(createSection);

module.exports = router;
