"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quizSchema = new mongoose_1.default.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
});
const moduleSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    completed: { type: Boolean, default: false },
    quiz: [quizSchema],
});
const courseSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    modules: [moduleSchema],
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    progress: { type: Number, default: 0 },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Course", courseSchema);
