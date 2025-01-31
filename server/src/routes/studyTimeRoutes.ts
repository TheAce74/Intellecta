import express from "express";
import { getStudyTime, addStudyTime } from "../controllers/studyTimeController";

const router = express.Router();

router.get("/", getStudyTime);
router.post("/", addStudyTime);

export default router;
