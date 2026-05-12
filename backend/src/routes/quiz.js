const express = require("express");
const axios = require("axios");
const { protect } = require("../middleware/auth");

const router = express.Router();
const AI_URL = process.env.AI_SERVICE_URL;

// POST /api/quiz/generate/:courseId
router.post("/generate/:courseId", protect, async (req, res) => {
  const { numQuestions = 5, topic, documentText } = req.body;

  const response = await axios.post(`${AI_URL}/quiz/generate`, {
    courseId: req.params.courseId,
    numQuestions,
    topic,
    documentText,
  });

  res.json(response.data);
});

// POST /api/quiz/:quizId/submit
router.post("/:quizId/submit", protect, async (req, res) => {
  const { answers } = req.body;
  const response = await axios.post(`${AI_URL}/quiz/${req.params.quizId}/evaluate`, { answers });
  res.json(response.data);
});

module.exports = router;
