"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateNextReview = void 0;
function calculateNextReview(reviewResult, currentEaseFactor, currentInterval) {
    const { quality, difficulty } = reviewResult;
    // Update ease factor
    let easeFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);
    // Calculate new interval
    let interval;
    if (currentInterval === 0) {
        interval = 1;
    }
    else if (currentInterval === 1) {
        interval = 6;
    }
    else {
        interval = Math.round(currentInterval * easeFactor);
    }
    // Adjust interval based on difficulty
    switch (difficulty) {
        case "Easy":
            interval = Math.round(interval * 1.2);
            break;
        case "Hard":
            interval = Math.round(interval * 0.8);
            break;
    }
    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);
    return { nextReviewDate, easeFactor, interval };
}
exports.calculateNextReview = calculateNextReview;
