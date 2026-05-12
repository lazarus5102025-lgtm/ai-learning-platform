require("dotenv").config();
require("express-async-errors");

const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const quizRoutes = require("./routes/quiz");
const chatRoutes = require("./routes/chat");
const analyticsRoutes = require("./routes/analytics");
const adminRoutes = require("./routes/admin");
const searchRoutes = require("./routes/search");

const app = express();
const server = http.createServer(app);

// Connect DB
connectDB();

// Init Socket.io
initSocket(server);

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
