const express = require("express");

const {
  createPoll,
  getMyPolls,
  getPublicPoll,
  getPollAnalytics,
  publishPollResults,
  getPublicResults,
  getPublishedPolls
} = require("../controllers/pollController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPoll);

router.get("/my", protect, getMyPolls);

router.get("/:id/analytics", protect, getPollAnalytics);

router.put("/:id/publish", protect, publishPollResults);

router.get("/:id/results", getPublicResults);

router.get("/:id", getPublicPoll);
router.get(
  "/published/all",
  getPublishedPolls
);

module.exports = router;