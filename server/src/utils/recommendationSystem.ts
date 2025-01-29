import Course from "../models/Course"
import Flashcard from "../models/Flashcard"

interface RecommendationItem {
  type: "course" | "flashcard"
  id: string
  title: string
  similarity: number
}

export async function getRecommendations(userId: string): Promise<RecommendationItem[]> {
  const userCourses = await Course.find({ user: userId })
  const userFlashcards = await Flashcard.find({ user: userId })

  const allCourses = await Course.find({ user: { $ne: userId } })
  const allFlashcards = await Flashcard.find({ user: { $ne: userId } })

  const recommendations: RecommendationItem[] = []

  // Simple collaborative filtering based on course subjects
  for (const course of allCourses) {
    const similarity = calculateCourseSimilarity(course, userCourses)
    if (similarity > 0) {
      recommendations.push({
        type: "course",
        id: course._id.toString(),
        title: course.title,
        similarity,
      })
    }
  }

  // Simple collaborative filtering based on flashcard decks
  for (const flashcard of allFlashcards) {
    const similarity = calculateFlashcardSimilarity(flashcard, userFlashcards)
    if (similarity > 0) {
      recommendations.push({
        type: "flashcard",
        id: flashcard._id.toString(),
        title: flashcard.deck,
        similarity,
      })
    }
  }

  // Sort recommendations by similarity score
  recommendations.sort((a, b) => b.similarity - a.similarity)

  return recommendations.slice(0, 10) // Return top 10 recommendations
}

function calculateCourseSimilarity(course: any, userCourses: any[]): number {
  const courseSubjects = course.title.toLowerCase().split(" ")
  let similarity = 0

  for (const userCourse of userCourses) {
    const userSubjects = userCourse.title.toLowerCase().split(" ")
    const commonSubjects = courseSubjects.filter((subject) => userSubjects.includes(subject))
    similarity += commonSubjects.length / Math.max(courseSubjects.length, userSubjects.length)
  }

  return similarity / userCourses.length
}

function calculateFlashcardSimilarity(flashcard: any, userFlashcards: any[]): number {
  const flashcardDeck = flashcard.deck.toLowerCase()
  let similarity = 0

  for (const userFlashcard of userFlashcards) {
    const userDeck = userFlashcard.deck.toLowerCase()
    if (flashcardDeck === userDeck) {
      similarity += 1
    }
  }

  return similarity / userFlashcards.length
}

