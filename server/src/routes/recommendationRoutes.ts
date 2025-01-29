import express from "express"
import { getUserRecommendations } from "../controllers/recommendationController"

const router = express.Router()

router.get("/", getUserRecommendations)

export default router

