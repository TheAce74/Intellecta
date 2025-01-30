import express from "express";
import {
  createFlashcards,
  saveFlashcards,
  getFlashcards,
  deleteFlashcard,
  reviewFlashcard,
} from "../controllers/flashcardController";

const router = express.Router();

router.post("/create", createFlashcards);
router.post("/", saveFlashcards);
router.get("/", getFlashcards);
router.delete("/:id", deleteFlashcard);
router.post("/:id/review", reviewFlashcard);

export default router;
