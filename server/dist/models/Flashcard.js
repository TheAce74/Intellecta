"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const flashcardSchema = new mongoose_1.default.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    deck: { type: String, default: "Default" },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    nextReviewDate: { type: Date, default: Date.now },
    reviewCount: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Flashcard", flashcardSchema);
