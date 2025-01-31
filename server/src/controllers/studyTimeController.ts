import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import StudyTime from "../models/StudyTime";

export const getStudyTime = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const studyTimeData = await StudyTime.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          minutes: { $sum: "$minutes" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          minutes: 1,
        },
      },
    ]);

    res.json(studyTimeData);
  } catch (error) {
    console.error("Error fetching study time data:", error);
    res.status(500).json({ error: "Error fetching study time data" });
  }
};

export const addStudyTime = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { minutes } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const studyTime = new StudyTime({
      user: userId,
      date: new Date(),
      minutes,
    });

    await studyTime.save();

    res.status(201).json(studyTime);
  } catch (error) {
    console.error("Error adding study time:", error);
    res.status(500).json({ error: "Error adding study time" });
  }
};
