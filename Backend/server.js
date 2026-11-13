
const dns = require("dns");

// Keep this because your MongoDB Atlas connection previously needed it.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Load environment variables FIRST.
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./Routes/authRoutes");
const applicationRoutes = require("./Routes/ApplicationRoutes");
const jobRoutes = require("./Routes/jobsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/jobs", jobRoutes);

// Create uploads folder inside the Backend directory.
const uploadsDirectory = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
}

// Serve uploaded resumes.
app.use("/uploads", express.static(uploadsDirectory));

// Authentication, registration, login, and profile routes.
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Test route.
app.get("/", (req, res) => {
    res.send("Student Placement Portal Backend is running");
});

// MongoDB configuration.
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
    console.error(
        "MongoDB connection failed: MONGO_URI is missing. Check your .env file."
    );
    process.exit(1);
}

// Connect to MongoDB and start the server.
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });
