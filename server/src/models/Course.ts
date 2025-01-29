import mongoose from "mongoose"

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
})

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  completed: { type: Boolean, default: false },
  quiz: [quizSchema],
})

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    modules: [moduleSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    progress: { type: Number, default: 0 },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  },
  { timestamps: true },
)

export default mongoose.model("Course", courseSchema)

