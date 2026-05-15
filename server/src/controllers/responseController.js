const Poll = require("../models/Poll");
const Response = require("../models/Response");
const { getIO } = require("../socket");

exports.submitResponse = async (req, res) => {
  try {

    const pollId = req.params.pollId;

    const { answers } = req.body;

    // Find poll
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }

    // Expiry validation
    if (poll.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Poll has expired"
      });
    }

    // Required question validation
    for (const question of poll.questions) {

      if (question.required) {

        const answered = answers.find(
          (a) =>
            a.questionId === question._id.toString()
        );

        if (!answered) {
          return res.status(400).json({
            message: `${question.questionText} is required`
          });
        }
      }
    }

    // Save response
    const response = await Response.create({
  pollId,

  userId: req.user ? req.user._id : null,

  answers
});

// Emit realtime update
const io = getIO();

io.to(pollId).emit("new_response", {
  pollId,
  message: "New response submitted"
});

    res.status(201).json({
      message: "Response submitted successfully",
      response
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



