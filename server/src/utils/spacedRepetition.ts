interface ReviewResult {
  quality: number // 0-5, where 0 is complete blackout and 5 is perfect recall
  difficulty: "Easy" | "Medium" | "Hard"
}

export function calculateNextReview(
  reviewResult: ReviewResult,
  currentEaseFactor: number,
  currentInterval: number,
): {
  nextReviewDate: Date
  easeFactor: number
  interval: number
} {
  const { quality, difficulty } = reviewResult

  // Update ease factor
  let easeFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  easeFactor = Math.max(1.3, easeFactor)

  // Calculate new interval
  let interval: number
  if (currentInterval === 0) {
    interval = 1
  } else if (currentInterval === 1) {
    interval = 6
  } else {
    interval = Math.round(currentInterval * easeFactor)
  }

  // Adjust interval based on difficulty
  switch (difficulty) {
    case "Easy":
      interval = Math.round(interval * 1.2)
      break
    case "Hard":
      interval = Math.round(interval * 0.8)
      break
  }

  // Calculate next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return { nextReviewDate, easeFactor, interval }
}

