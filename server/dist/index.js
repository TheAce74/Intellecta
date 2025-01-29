"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const flashcardRoutes_1 = __importDefault(require("./routes/flashcardRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/courses", auth_1.authenticateToken, courseRoutes_1.default);
app.use("/api/flashcards", auth_1.authenticateToken, flashcardRoutes_1.default);
app.use("/api/recommendations", auth_1.authenticateToken, recommendationRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
