const express = require("express");
const axios = require("axios");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { query, courseId } = req.body;
  const response = await axios.post(`${process.env.AI_SERVICE_URL}/search`, { query, courseId });
  res.json(response.data);
});

module.exports = router;
