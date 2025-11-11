// src/models/Question.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "comportamiento",
        "tecnica",
        "cultura",
        "diagnostico",
        "general",
      ],
      default: "general",
    },
    level: {
      type: String,
      enum: ["junior", "medio", "senior"],
      default: "junior",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Question =
  mongoose.models.Question ||
  mongoose.model("Question", questionSchema);

export default Question;
