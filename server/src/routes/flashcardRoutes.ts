import express from "express"
import multer from "multer"
import {
  createFlashcards,
  saveFlashcards,
  getFlashcards,
  deleteFlashcard,
  reviewFlashcard,
} from "../controllers/flashcardController"

const router = express.Router()
const upload = multer({ dest: "uploads/" })

router.post("/create", upload.single("file"), createFlashcards)
router.post("/", saveFlashcards)
router.get("/", getFlashcards)
router.delete("/:id", deleteFlashcard)
router.post("/:id/review", reviewFlashcard)

export default router

