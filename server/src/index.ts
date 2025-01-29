import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes"
import courseRoutes from "./routes/courseRoutes"
import flashcardRoutes from "./routes/flashcardRoutes"
import recommendationRoutes from "./routes/recommendationRoutes"
import { authenticateToken } from "./middleware/auth"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", authenticateToken, courseRoutes)
app.use("/api/flashcards", authenticateToken, flashcardRoutes)
app.use("/api/recommendations", authenticateToken, recommendationRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

