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
exports.updateModuleProgress = exports.deleteCourse = exports.getCourses = exports.saveCourse = exports.generateCourse = void 0;
const openai_1 = require("openai");
const Course_1 = __importDefault(require("../models/Course"));
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const generateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { subject, difficulty, length, specificTopics } = req.body;
        const prompt = `Create a ${difficulty} level course outline for ${subject} with ${length} modules. ${specificTopics ? `Include the following specific topics: ${specificTopics.join(", ")}.` : ""} Each module should have a title and a brief description.`;
        const response = yield openai.createCompletion({
            model: "text-davinci-002",
            prompt,
            max_tokens: 1000,
            n: 1,
            temperature: 0.7,
        });
        const courseOutline = (_a = response.data.choices[0].text) === null || _a === void 0 ? void 0 : _a.trim();
        // Parse the course outline into a structured format
        const courseStructure = parseCourseOutline(courseOutline || "");
        // Generate quizzes for each module
        const courseWithQuizzes = yield generateQuizzesForModules(courseStructure);
        res.json(courseWithQuizzes);
    }
    catch (error) {
        console.error("Error generating course:", error);
        res.status(500).json({ error: "Error generating course" });
    }
});
exports.generateCourse = generateCourse;
const saveCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { title, modules } = req.body;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const course = new Course_1.default({ title, modules, user: userId });
        yield course.save();
        res.status(201).json(course);
    }
    catch (error) {
        console.error("Error saving course:", error);
        res.status(500).json({ error: "Error saving course" });
    }
});
exports.saveCourse = saveCourse;
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        const { search, difficulty } = req.query;
        const query = { user: userId };
        if (difficulty)
            query.difficulty = difficulty;
        if (search) {
            query.$or = [{ title: { $regex: search, $options: "i" } }, { "modules.title": { $regex: search, $options: "i" } }];
        }
        const courses = yield Course_1.default.find(query);
        res.json(courses);
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Error fetching courses" });
    }
});
exports.getCourses = getCourses;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const courseId = req.params.id;
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
        const course = yield Course_1.default.findOneAndDelete({ _id: courseId, user: userId });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json({ message: "Course deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ error: "Error deleting course" });
    }
});
exports.deleteCourse = deleteCourse;
const updateModuleProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { courseId, moduleIndex, completed } = req.body;
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
        const course = yield Course_1.default.findOne({ _id: courseId, user: userId });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        course.modules[moduleIndex].completed = completed;
        course.progress = (course.modules.filter((m) => m.completed).length / course.modules.length) * 100;
        yield course.save();
        res.json({ message: "Progress updated successfully", course });
    }
    catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({ error: "Error updating progress" });
    }
});
exports.updateModuleProgress = updateModuleProgress;
function parseCourseOutline(outline) {
    const lines = outline.split("\n");
    const course = {
        title: lines[0],
        modules: [],
    };
    let currentModule = null;
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("Module")) {
            if (currentModule) {
                course.modules.push(currentModule);
            }
            currentModule = { title: line, content: "" };
        }
        else if (currentModule) {
            currentModule.content += line + " ";
        }
    }
    if (currentModule) {
        course.modules.push(currentModule);
    }
    return course;
}
function generateQuizzesForModules(course) {
    return __awaiter(this, void 0, void 0, function* () {
        const courseWithQuizzes = Object.assign(Object.assign({}, course), { modules: yield Promise.all(course.modules.map((module) => __awaiter(this, void 0, void 0, function* () {
                const quiz = yield generateQuizForModule(module);
                return Object.assign(Object.assign({}, module), { quiz });
            }))) });
        return courseWithQuizzes;
    });
}
function generateQuizForModule(module) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
        const response = yield openai.createCompletion({
            model: "text-davinci-002",
            prompt,
            max_tokens: 1000,
            n: 1,
            temperature: 0.7,
        });
        const quizJson = (_a = response.data.choices[0].text) === null || _a === void 0 ? void 0 : _a.trim();
        return JSON.parse(quizJson || "[]");
    });
}
