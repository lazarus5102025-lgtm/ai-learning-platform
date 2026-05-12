// backend/src/routes/chat.js
const express = require("express");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/rooms", protect, (req, res) => {
  res.json({ rooms: [] }); // Extend with ChatRoom model
});

module.exports = router;
