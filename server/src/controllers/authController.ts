import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User"

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "1d" })

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "1d" })

    res.json({ user: { id: user._id, name: user.name, email: user.email }, token })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const logout = (req: Request, res: Response) => {
  // In a real-world scenario, you might want to invalidate the token on the server-side
  // For now, we'll just send a success response
  res.json({ message: "Logged out successfully" })
}

