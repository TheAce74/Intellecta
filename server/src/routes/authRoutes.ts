import express from "express";
import {
  register,
  login,
  logout,
  getUser,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", authenticateToken, getUser);

export default router;
