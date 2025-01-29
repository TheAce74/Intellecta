"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const Flashcard_1 = __importDefault(require("../models/Flashcard"));
function getRecommendations(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userCourses = yield Course_1.default.find({ user: userId });
        const userFlashcards = yield Flashcard_1.default.find({ user: userId });
        const allCourses = yield Course_1.default.find({ user: { $ne: userId } });
        const allFlashcards = yield Flashcard_1.default.find({ user: { $ne: userId } });
        const recommendations = [];
        // Simple collaborative filtering based on course subjects
        for (const course of allCourses) {
            const similarity = calculateCourseSimilarity(course, userCourses);
            if (similarity > 0) {
                recommendations.push({
                    type: "course",
                    id: course._id.toString(),
                    title: course.title,
                    similarity,
                });
            }
        }
        // Simple collaborative filtering based on flashcard decks
        for (const flashcard of allFlashcards) {
            const similarity = calculateFlashcardSimilarity(flashcard, userFlashcards);
            if (similarity > 0) {
                recommendations.push({
                    type: "flashcard",
                    id: flashcard._id.toString(),
                    title: flashcard.deck,
                    similarity,
                });
            }
        }
        // Sort recommendations by similarity score
        recommendations.sort((a, b) => b.similarity - a.similarity);
        return recommendations.slice(0, 10); // Return top 10 recommendations
    });
}
exports.getRecommendations = getRecommendations;
function calculateCourseSimilarity(course, userCourses) {
    const courseSubjects = course.title.toLowerCase().split(" ");
    let similarity = 0;
    for (const userCourse of userCourses) {
        const userSubjects = userCourse.title.toLowerCase().split(" ");
        const commonSubjects = courseSubjects.filter((subject) => userSubjects.includes(subject));
        similarity +=
            commonSubjects.length /
                Math.max(courseSubjects.length, userSubjects.length);
    }
    return similarity / userCourses.length;
}
function calculateFlashcardSimilarity(flashcard, userFlashcards) {
    const flashcardDeck = flashcard.deck.toLowerCase();
    let similarity = 0;
    for (const userFlashcard of userFlashcards) {
        const userDeck = userFlashcard.deck.toLowerCase();
        if (flashcardDeck === userDeck) {
            similarity += 1;
        }
    }
    return similarity / userFlashcards.length;
}
