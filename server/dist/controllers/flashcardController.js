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
exports.deleteFlashcard = exports.reviewFlashcard = exports.getFlashcards = exports.saveFlashcards = exports.createFlashcards = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
const openai_1 = require("openai");
const Flashcard_1 = __importDefault(require("../models/Flashcard"));
const spacedRepetition_1 = require("../utils/spacedRepetition");
const multer_1 = __importDefault(require("multer"));
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const upload = (0, multer_1.default)({ dest: "uploads/" });
const createFlashcards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        upload.single("file")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const fileContent = yield extractFileContent(req.file);
            const flashcards = yield generateFlashcards(fileContent);
            res.json(flashcards);
        }));
    }
    catch (error) {
        console.error("Error creating flashcards:", error);
        res.status(500).json({ error: "Error creating flashcards" });
    }
});
exports.createFlashcards = createFlashcards;
const saveFlashcards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const flashcardsData = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const savedFlashcards = yield Promise.all(flashcardsData.map((flashcardData) => __awaiter(void 0, void 0, void 0, function* () {
            const flashcard = new Flashcard_1.default(Object.assign(Object.assign({}, flashcardData), { user: userId }));
            return yield flashcard.save();
        })));
        res.status(201).json(savedFlashcards);
    }
    catch (error) {
        console.error("Error saving flashcards:", error);
        res.status(500).json({ error: "Error saving flashcards" });
    }
});
exports.saveFlashcards = saveFlashcards;
const getFlashcards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const { deck, difficulty, search } = req.query;
        const query = { user: userId };
        if (deck)
            query.deck = deck;
        if (difficulty)
            query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { question: { $regex: search, $options: "i" } },
                { answer: { $regex: search, $options: "i" } },
            ];
        }
        const flashcards = yield Flashcard_1.default.find(query).sort({ nextReviewDate: 1 });
        res.json(flashcards);
    }
    catch (error) {
        console.error("Error fetching flashcards:", error);
        res.status(500).json({ error: "Error fetching flashcards" });
    }
});
exports.getFlashcards = getFlashcards;
const reviewFlashcard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { id } = req.params;
        const { quality, difficulty } = req.body;
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        const flashcard = yield Flashcard_1.default.findOne({ _id: id, user: userId });
        if (!flashcard) {
            return res.status(404).json({ error: "Flashcard not found" });
        }
        const { nextReviewDate, easeFactor, interval } = (0, spacedRepetition_1.calculateNextReview)({ quality, difficulty }, flashcard.easeFactor, flashcard.interval);
        flashcard.nextReviewDate = nextReviewDate;
        flashcard.easeFactor = easeFactor;
        flashcard.interval = interval;
        flashcard.reviewCount += 1;
        flashcard.difficulty = difficulty;
        yield flashcard.save();
        res.json(flashcard);
    }
    catch (error) {
        console.error("Error reviewing flashcard:", error);
        res.status(500).json({ error: "Error reviewing flashcard" });
    }
});
exports.reviewFlashcard = reviewFlashcard;
const deleteFlashcard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const flashcardId = req.params.id;
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
        const flashcard = yield Flashcard_1.default.findOneAndDelete({
            _id: flashcardId,
            user: userId,
        });
        if (!flashcard) {
            return res.status(404).json({ error: "Flashcard not found" });
        }
        res.json({ message: "Flashcard deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting flashcard:", error);
        res.status(500).json({ error: "Error deleting flashcard" });
    }
});
exports.deleteFlashcard = deleteFlashcard;
function extractFileContent(file) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { originalname, path } = file;
        const fileExtension = (_a = originalname.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        let content = "";
        switch (fileExtension) {
            case "pdf":
                const pdfData = yield (0, pdf_parse_1.default)(fs_1.default.readFileSync(path));
                content = pdfData.text;
                break;
            case "docx":
                const result = yield mammoth_1.default.extractRawText({ path });
                content = result.value;
                break;
            case "txt":
                content = fs_1.default.readFileSync(path, "utf-8");
                break;
            default:
                throw new Error("Unsupported file format");
        }
        fs_1.default.unlinkSync(path); // Remove the temporary file
        return content;
    });
}
function generateFlashcards(content) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `Generate 5 flashcards based on the following content. Each flashcard should have a question and an answer. Format the output as JSON:

Content:
${content.substring(0, 1000)} // Limit content to 1000 characters

Output format:
[
  {
    "question": "...",
    "answer": "..."
  },
  ...
]`;
        const response = yield openai.createCompletion({
            model: "text-davinci-002",
            prompt,
            max_tokens: 500,
            n: 1,
            temperature: 0.7,
        });
        const flashcardsJson = (_a = response.data.choices[0].text) === null || _a === void 0 ? void 0 : _a.trim();
        return JSON.parse(flashcardsJson || "[]");
    });
}
