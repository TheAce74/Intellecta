import express from "express"
import {
  generateCourse,
  saveCourse,
  getCourses,
  deleteCourse,
  updateModuleProgress,
} from "../controllers/courseController"

const router = express.Router()

router.post("/generate", generateCourse)
router.post("/", saveCourse)
router.get("/", getCourses)
router.delete("/:id", deleteCourse)
router.post("/progress", updateModuleProgress)

export default router

