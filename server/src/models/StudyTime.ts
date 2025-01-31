import mongoose from "mongoose";

const studyTimeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    minutes: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("StudyTime", studyTimeSchema);
