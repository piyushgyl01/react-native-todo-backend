const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Debug environment loading
console.log("Current working directory:", process.cwd());
console.log("Environment variables:", process.env);

// Load env vars with debug
try {
  dotenv.config({
    path: "./config/config.env",
    debug: true,
  });
} catch (error) {
  console.error("Error loading .env file:", error);
}

// Verify PORT is set
console.log("PORT from env:", process.env.PORT);

// Connect to database with error logging
try {
  connectDB();
} catch (error) {
  console.error("Database connection error:", error);
}

const app = express();

// Extensive logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));
  next();
});

// Body parsing with error handling
app.use((err, req, res, next) => {
  console.error("Body parsing error:", err);
  res.status(400).send("Invalid JSON");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS with debug
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Route files
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Mount routers with logging
app.use(
  "/api/auth",
  (req, res, next) => {
    console.log("Auth route accessed");
    next();
  },
  authRoutes
);

app.use(
  "/api/tasks",
  (req, res, next) => {
    console.log("Tasks route accessed");
    next();
  },
  taskRoutes
);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

const PORT = process.env.PORT || 5000;

// Explicit server start with comprehensive logging
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`
  ===== SERVER STARTED =====
  - Port: ${PORT}
  - Environment: ${process.env.NODE_ENV}
  - Timestamp: ${new Date().toISOString()}
  =======================
  `);
});

// Global unhandled rejection and exception handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
