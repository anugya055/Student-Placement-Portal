const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

const router = express.Router();

// =====================================
// Resume Upload Configuration
// =====================================

const uploadsDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${req.params.id}-${Date.now()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      extension === ".pdf" &&
      file.mimetype === "application/pdf"
    ) {
      return cb(null, true);
    }

    cb(new Error("Only PDF files are allowed."));
  },
});

// =====================================
// Student Registration
// POST /api/auth/register
// =====================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      college,
      course,
      graduationYear,
      cgpa,
      skills,
      resume,
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingStudent = await Student.findOne({
      email: normalizedEmail,
    });

    if (existingStudent) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
      college: college || "",
      course: course || "",
      graduationYear: graduationYear || undefined,
      cgpa: cgpa || undefined,
      skills: Array.isArray(skills) ? skills : [],
      resume: resume || "",
    });

    return res.status(201).json({
      message: "Registration successful.",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    return res.status(500).json({
      message: "Registration failed.",
    });
  }
});

// =====================================
// Student Login
// POST /api/auth/login
// =====================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const student = await Student.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!student) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      student.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      message: "Login successful.",
      id: student._id,
      name: student.name,
      email: student.email,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed.",
    });
  }
});

// =====================================
// Admin Login
// POST /api/auth/admin-login
// =====================================

router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Check JWT Secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication configuration error.",
      });
    }

    // Find only admin account
    const admin = await Student.findOne({
      email: email.trim().toLowerCase(),
      role: "admin",
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin email or password.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid admin email or password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Admin login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      message: "Admin login failed.",
    });
  }
});

// =====================================
// Get Student Profile
// GET /api/auth/profile/:id
// =====================================

router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid student ID.",
      });
    }

    const student = await Student.findById(id).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch profile.",
    });
  }
});

// =====================================
// Update Student Profile
// PUT /api/auth/profile/:id
// =====================================

router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid student ID.",
      });
    }

    const {
      name,
      firstName,
      lastName,
      email,
      phone,
      location,
      college,
      course,
      graduationYear,
      cgpa,
      skills,
      github,
      linkedin,
      bio,
    } = req.body || {};

    const updates = {};

    if (name !== undefined) {
      updates.name = name;
    } else if (
      firstName !== undefined ||
      lastName !== undefined
    ) {
      updates.name = `${firstName || ""} ${lastName || ""}`.trim();
    }

    if (email !== undefined) {
      updates.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    if (college !== undefined) updates.college = college;
    if (course !== undefined) updates.course = course;
    if (github !== undefined) updates.github = github;
    if (linkedin !== undefined) updates.linkedin = linkedin;
    if (bio !== undefined) updates.bio = bio;

    if (graduationYear !== undefined) {
      updates.graduationYear =
        graduationYear === "" ? undefined : Number(graduationYear);
    }

    if (cgpa !== undefined) {
      updates.cgpa = cgpa === "" ? undefined : Number(cgpa);
    }

    if (skills !== undefined) {
      updates.skills = Array.isArray(skills)
        ? skills
        : typeof skills === "string"
          ? skills.split(",").map((skill) => skill.trim()).filter(Boolean)
          : [];
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      student,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "That email is already registered.",
      });
    }

    return res.status(500).json({
      message: "Failed to update profile.",
    });
  }
});

// =====================================
// Upload Student Resume
// POST /api/auth/profile/:id/resume
// =====================================

router.post(
  "/profile/:id/resume",
  (req, res, next) => {
    upload.single("resume")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "Resume must be 5 MB or smaller."
              : error.message || "Resume upload failed.",
        });
      }

      next();
    });
  },
  async (req, res) => {
    let uploadedFilePath;

    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        if (req.file) fs.unlinkSync(req.file.path);

        return res.status(400).json({
          message: "Invalid student ID.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Please select a PDF resume.",
        });
      }

      uploadedFilePath = req.file.path;

      const student = await Student.findById(id);

      if (!student) {
        fs.unlinkSync(uploadedFilePath);

        return res.status(404).json({
          message: "Student not found.",
        });
      }

      const oldResume = student.resume;
      const newResumePath = `/uploads/${req.file.filename}`;

      student.resume = newResumePath;
      await student.save();

      // Delete the old uploaded resume after the new one is saved
      if (oldResume && oldResume.startsWith("/uploads/")) {
        const oldFilename = path.basename(oldResume);
        const oldFilePath = path.join(
          uploadsDirectory,
          oldFilename
        );

        if (
          fs.existsSync(oldFilePath) &&
          oldFilePath !== uploadedFilePath
        ) {
          fs.unlinkSync(oldFilePath);
        }
      }

      return res.status(200).json({
        message: "Resume uploaded successfully.",
        resume: student.resume,
        resumeUrl: `http://localhost:5000${student.resume}`,
      });
    } catch (error) {
      console.error("Resume upload error:", error.message);

      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      return res.status(500).json({
        message: "Failed to save resume.",
      });
    }
  }
);

// =====================================
// Export Router
// =====================================

module.exports = router;