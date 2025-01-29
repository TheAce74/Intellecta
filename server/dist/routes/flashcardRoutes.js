"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const flashcardController_1 = require("../controllers/flashcardController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/create", upload.single("file"), flashcardController_1.createFlashcards);
router.post("/", flashcardController_1.saveFlashcards);
router.get("/", flashcardController_1.getFlashcards);
router.delete("/:id", flashcardController_1.deleteFlashcard);
router.post("/:id/review", flashcardController_1.reviewFlashcard);
exports.default = router;
