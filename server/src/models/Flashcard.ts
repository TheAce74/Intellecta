import mongoose from "mongoose"

const flashcardSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deck: { type: String, default: "Default" },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    nextReviewDate: { type: Date, default: Date.now },
    reviewCount: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.model("Flashcard", flashcardSchema)

