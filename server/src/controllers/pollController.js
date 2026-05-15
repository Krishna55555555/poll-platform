const Poll = require("../models/Poll");
const Response = require("../models/Response");



exports.createPoll = async (req, res) => {
  try {

    const {
      title,
      description,
      questions,
      responseMode,
      expiresAt
    } = req.body;

    // Basic validation
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        message: "Title and questions are required"
      });
    }

    // Create poll
    const poll = await Poll.create({
      title,
      description,
      questions,
      responseMode,
      expiresAt,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Poll created successfully",
      poll
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


exports.getMyPolls = async (req, res) => {
  try {

    const polls = await Poll.find({
      createdBy: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json(polls);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


exports.getPublicPoll = async (req, res) => {
  try {

    const poll = await Poll.findById(req.params.id);

    // Poll not found
    if (!poll) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }

    // Expiry check
    const now = new Date();

    if (poll.expiresAt < now) {
      return res.status(400).json({
        message: "Poll has expired"
      });
    }

    // Return safe public data
    res.status(200).json({
      _id: poll._id,

      title: poll.title,

      description: poll.description,

      responseMode: poll.responseMode,

      expiresAt: poll.expiresAt,

      questions: poll.questions.map((question) => ({
        _id: question._id,

        questionText: question.questionText,

        required: question.required,

        options: question.options
      }))
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



exports.getPollAnalytics = async (req, res) => {
  try {

    const pollId = req.params.id;

    // Find poll
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }

    // Security check
    if (poll.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    // Get responses
    const responses = await Response.find({
      pollId
    });

    // Total responses
    const totalResponses = responses.length;

    // Analytics array
    const analytics = poll.questions.map((question) => {

      // Option counting
      const optionCounts = {};

      // Initialize counts
      question.options.forEach((option) => {
        optionCounts[option.text] = 0;
      });

      // Count responses
      responses.forEach((response) => {

        const answer = response.answers.find(
          (a) =>
            a.questionId.toString() === question._id.toString()
        );

        if (answer) {
          optionCounts[answer.selectedOption]++;
        }

      });

      // Convert to array
      const optionsAnalytics = Object.keys(optionCounts).map((option) => ({

        option,

        count: optionCounts[option],

        percentage:
          totalResponses > 0
            ? (
                (optionCounts[option] / totalResponses) * 100
              ).toFixed(1)
            : 0

      }));

      return {
        questionId: question._id,

        question: question.questionText,

        totalResponses,

        options: optionsAnalytics
      };

    });

    res.status(200).json({
      pollId: poll._id,

      title: poll.title,

      totalResponses,

      analytics
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


exports.publishPollResults = async (req, res) => {
  try {

    const poll = await Poll.findById(req.params.id);

    // Poll not found
    if (!poll) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }

    // Security check
    if (poll.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    // Publish results
    poll.isPublished = true;

    await poll.save();

    res.status(200).json({
      message: "Poll results published successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


const getPublicResults = async (
  req,
  res
) => {

  try {

    // Find poll
    const poll = await Poll.findById(
      req.params.id
    );

    // Poll not found
    if (!poll) {

      return res.status(404).json({
        message: "Poll not found"
      });

    }

    // Check published
    if (!poll.isPublished) {

      return res.status(403).json({
        message:
          "Results are not published yet"
      });

    }

    // Get all responses
    const responses =
      await Response.find({
        pollId: poll._id
      });

    const totalResponses =
      responses.length;

    // Generate analytics
    const analytics =
      poll.questions.map((question) => {

        // Initialize option counts
        const optionCounts = {};

        question.options.forEach(
          (option) => {

            optionCounts[
              option.text
            ] = 0;

          }
        );

        // Count answers
        responses.forEach((response) => {

          const answer =
            response.answers.find(
              (a) =>
                a.questionId.toString() ===
                question._id.toString()
            );

          if (
            answer &&
            optionCounts[
              answer.selectedOption
            ] !== undefined
          ) {

            optionCounts[
              answer.selectedOption
            ]++;

          }

        });

        // Convert to analytics array
        const options =
          Object.entries(optionCounts).map(
            ([option, count]) => ({

              option,

              count,

              percentage:
                totalResponses > 0

                  ? (
                      (count /
                        totalResponses) *
                      100
                    ).toFixed(1)

                  : 0

            })
          );

        return {

          question:
            question.questionText,

          options

        };

      });

    // Final response
    res.status(200).json({

      pollId: poll._id,

      title: poll.title,

      totalResponses,

      analytics

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// EXPORT
exports.getPublicResults =
  getPublicResults;



const getPublishedPolls = async (
  req,
  res
) => {

  try {

    const polls = await Poll.find({

      isPublished: true

    })
      .select(
        "title description createdAt"
      )
      .sort({
        createdAt: -1
      });

    const Response =
      require("../models/Response");

    const pollsWithCounts =
      await Promise.all(

        polls.map(async (poll) => {

          const responseCount =
            await Response.countDocuments({

              pollId: poll._id

            });

          return {

            ...poll.toObject(),

            totalResponses:
              responseCount

          };

        })

      );

    res.status(200).json(
      pollsWithCounts
    );

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

exports.getPublishedPolls =
  getPublishedPolls;