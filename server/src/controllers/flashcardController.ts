import type { Request, Response } from "express";
import fs from "fs";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import Flashcard from "../models/Flashcard";
import type { AuthRequest } from "../middleware/auth";
import { calculateNextReview } from "../utils/spacedRepetition";
import multer from "multer";
import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

const upload = multer({ dest: "uploads/" });

export const createFlashcards = async (req: Request, res: Response) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileContent = await extractFileContent(req.file);
      const flashcards = await generateFlashcards(fileContent);
      res.json(flashcards);
    });
  } catch (error) {
    console.error("Error creating flashcards:", error);
    res.status(500).json({ error: "Error creating flashcards" });
  }
};

export const saveFlashcards = async (req: AuthRequest, res: Response) => {
  try {
    const flashcardsData = req.body;
    const userId = req.user?.id;

    const savedFlashcards = await Promise.all(
      flashcardsData.map(
        async (flashcardData: {
          question: string;
          answer: string;
          deck?: string;
          difficulty?: "Easy" | "Medium" | "Hard";
        }) => {
          const flashcard = new Flashcard({ ...flashcardData, user: userId });
          return await flashcard.save();
        }
      )
    );

    res.status(201).json(savedFlashcards);
  } catch (error) {
    console.error("Error saving flashcards:", error);
    res.status(500).json({ error: "Error saving flashcards" });
  }
};

export const getFlashcards = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { deck, difficulty, search } = req.query;

    const query: any = { user: userId };

    if (deck) query.deck = deck;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ];
    }

    const flashcards = await Flashcard.find(query).sort({ nextReviewDate: 1 });
    res.json(flashcards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    res.status(500).json({ error: "Error fetching flashcards" });
  }
};

export const reviewFlashcard = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { quality, difficulty } = req.body;
    const userId = req.user?.id;

    const flashcard = await Flashcard.findOne({ _id: id, user: userId });
    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    const { nextReviewDate, easeFactor, interval } = calculateNextReview(
      { quality, difficulty },
      flashcard.easeFactor,
      flashcard.interval
    );

    flashcard.nextReviewDate = nextReviewDate;
    flashcard.easeFactor = easeFactor;
    flashcard.interval = interval;
    flashcard.reviewCount += 1;
    flashcard.difficulty = difficulty;

    await flashcard.save();

    res.json(flashcard);
  } catch (error) {
    console.error("Error reviewing flashcard:", error);
    res.status(500).json({ error: "Error reviewing flashcard" });
  }
};

export const deleteFlashcard = async (req: AuthRequest, res: Response) => {
  try {
    const flashcardId = req.params.id;
    const userId = req.user?.id;

    const flashcard = await Flashcard.findOneAndDelete({
      _id: flashcardId,
      user: userId,
    });
    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    res.json({ message: "Flashcard deleted successfully" });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    res.status(500).json({ error: "Error deleting flashcard" });
  }
};

async function extractFileContent(file: Express.Multer.File): Promise<string> {
  const { originalname, path } = file;
  const fileExtension = originalname.split(".").pop()?.toLowerCase();

  let content = "";

  switch (fileExtension) {
    case "pdf":
      const pdfData = await pdf(fs.readFileSync(path));
      content = pdfData.text;
      break;
    case "docx":
      const result = await mammoth.extractRawText({ path });
      content = result.value;
      break;
    case "txt":
      content = fs.readFileSync(path, "utf-8");
      break;
    default:
      throw new Error("Unsupported file format");
  }

  fs.unlinkSync(path); // Remove the temporary file
  return content;
}

async function generateFlashcards(content: string) {
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

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "" },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-4o",
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
  });

  const flashcardsJson = completion.choices[0].message.content?.trim();
  return JSON.parse(flashcardsJson || "[]");
}
