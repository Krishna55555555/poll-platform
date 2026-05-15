const express = require("express");

const {
  submitResponse
} = require("../controllers/responseController");

const router = express.Router();

router.post("/:pollId", submitResponse);

module.exports = router;