import type { Request, Response } from "express";
import OpenAI from "openai";
import Course from "../models/Course";
import type { AuthRequest } from "../middleware/auth";
import "dotenv/config";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

export const generateCourse = async (req: Request, res: Response) => {
  try {
    const { subject, difficulty, length, specificTopics } = req.body;

    const prompt = `Create a ${difficulty} level course outline for ${subject} with ${length} modules. ${
      specificTopics
        ? `Include the following specific topics: ${specificTopics.join(", ")}.`
        : ""
    } Each module should have a title and a brief description.
    Your response should be in valid JSON, following the type/format below:
    {
      title: string;
      modules: {
        title: string;
        content: string;
      }
      difficulty: "beginner" | "intermediate" | "advanced";
    };
    `;

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

    const courseOutline = completion.choices[0].message.content?.trim();

    // Parse the course outline into a structured format
    const courseStructure = parseCourseOutline(courseOutline || "");

    // Generate quizzes for each module
    const courseWithQuizzes = await generateQuizzesForModules(courseStructure);

    res.json(courseWithQuizzes);
  } catch (error) {
    console.error("Error generating course:", error);
    res.status(500).json({ error: "Error generating course" });
  }
};

export const saveCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { title, modules, difficulty } = req.body;
    const userId = req.user?.id;

    const course = new Course({ title, modules, user: userId, difficulty });
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    console.error("Error saving course:", error);
    res.status(500).json({ error: "Error saving course" });
  }
};

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { search, difficulty } = req.query;

    const query: any = { user: userId };

    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "modules.title": { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Error fetching courses" });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.id;
    const userId = req.user?.id;

    const course = await Course.findOneAndDelete({
      _id: courseId,
      user: userId,
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Error deleting course" });
  }
};

export const updateModuleProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, moduleIndex, completed } = req.body;
    const userId = req.user?.id;

    const course = await Course.findOne({ _id: courseId, user: userId });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.modules[moduleIndex].completed = completed;
    course.progress =
      (course.modules.filter((m) => m.completed).length /
        course.modules.length) *
      100;

    await course.save();

    res.json({ message: "Progress updated successfully", course });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Error updating progress" });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response) => {
  try {
    const courseId = req.params.id;
    // const userId = req.user?.id;

    const course = await Course.findOne({ _id: courseId });
    // const course = await Course.findOne({ _id: courseId, user: userId });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Error fetching course" });
  }
};

function parseCourseOutline(outline: string) {
  const validJSON = outline.split("```json").join("").split("```").join("");
  const course = JSON.parse(validJSON) as {
    title: string;
    modules: { title: string; content: string }[];
  };
  return course;
}

async function generateQuizzesForModules(course: {
  title: string;
  modules: { title: string; content: string }[];
}) {
  const courseWithQuizzes = {
    ...course,
    modules: await generateQuizForModule(course.modules),
  };
  return courseWithQuizzes;
}

async function generateQuizForModule(
  modules: {
    title: string;
    content: string;
  }[]
) {
  const prompt = `Generate quizzes with 5 multiple-choice questions for each module based on the following modules contents:

${modules.map(
  (module) => `
Module: ${module.title}
Content: ${module.content}
`
)}

Output format:
[
  {
    title: "...",
    content: "...",
    quiz: [
      {
        "question": "...",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "correctAnswer": "A"
      },
      ...
    ]
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

  const quizJson = completion.choices[0].message.content?.trim();
  return JSON.parse(
    String(quizJson).split("```json").join("").split("```").join("")
  );
}
