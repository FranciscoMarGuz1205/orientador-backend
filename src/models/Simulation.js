// src/models/Simulation.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const simulationQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const simulationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [simulationQuestionSchema], // 👈 guardamos objeto {question, text}
    answers: [answerSchema],
    score: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Simulation =
  mongoose.models.Simulation ||
  mongoose.model("Simulation", simulationSchema);

export default Simulation;
