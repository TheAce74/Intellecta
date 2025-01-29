import type { Response } from "express"
import type { AuthRequest } from "../middleware/auth"
import { getRecommendations } from "../utils/recommendationSystem"

export const getUserRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const recommendations = await getRecommendations(userId)
    res.json(recommendations)
  } catch (error) {
    console.error("Error getting recommendations:", error)
    res.status(500).json({ error: "Error getting recommendations" })
  }
}

