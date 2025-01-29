import type { Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";
import Course from "../models/Course";
import type { AuthRequest } from "../middleware/auth";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateCourse = async (req: Request, res: Response) => {
  try {
    const { subject, difficulty, length, specificTopics } = req.body;

    const prompt = `Create a ${difficulty} level course outline for ${subject} with ${length} modules. ${
      specificTopics
        ? `Include the following specific topics: ${specificTopics.join(", ")}.`
        : ""
    } Each module should have a title and a brief description.`;

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt,
      max_tokens: 1000,
      n: 1,
      temperature: 0.7,
    });

    const courseOutline = response.data.choices[0].text?.trim();

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
    const { title, modules } = req.body;
    const userId = req.user?.id;

    const course = new Course({ title, modules, user: userId });
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

function parseCourseOutline(outline: string) {
  const lines = outline.split("\n");
  const course = {
    title: lines[0],
    modules: [] as { title: string; content: string }[],
  };

  let currentModule: { title: string; content: string } | null = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("Module")) {
      if (currentModule) {
        course.modules.push(currentModule);
      }
      currentModule = { title: line, content: "" };
    } else if (currentModule) {
      currentModule.content += line + " ";
    }
  }

  if (currentModule) {
    course.modules.push(currentModule);
  }

  return course;
}

async function generateQuizzesForModules(course: {
  title: string;
  modules: { title: string; content: string }[];
}) {
  const courseWithQuizzes = {
    ...course,
    modules: await Promise.all(
      course.modules.map(async (module) => {
        const quiz = await generateQuizForModule(module);
        return { ...module, quiz };
      })
    ),
  };
  return courseWithQuizzes;
}

async function generateQuizForModule(module: {
  title: string;
  content: string;
}) {
  const prompt = `Generate a quiz with 5 multiple-choice questions based on the following module content:

Module: ${module.title}
Content: ${module.content}

Output format:
[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A"
  },
  ...
]`;

  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
    max_tokens: 1000,
    n: 1,
    temperature: 0.7,
  });

  const quizJson = response.data.choices[0].text?.trim();
  return JSON.parse(quizJson || "[]");
}
