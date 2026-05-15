const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  }
});

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },

  required: {
    type: Boolean,
    default: false
  },

  options: [
    optionSchema
  ]
});

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    questions: [
      questionSchema
    ],

    responseMode: {
      type: String,
      enum: ["anonymous", "authenticated"],
      default: "anonymous"
    },

    expiresAt: {
      type: Date,
      required: true
    },

    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Poll", pollSchema);