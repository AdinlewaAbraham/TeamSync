const express = require("express");

const {
  createSection,
  deleteSection,
  getSection,
  updateSection,
} = require("../../controllers/sectionController/sectionController");

const router = express();

router.route("/:id").get(getSection).put(updateSection);
router.route("/:projectId/:sectionId").delete(deleteSection)
router.route("/").post(createSection);

module.exports = router;
