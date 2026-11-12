
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs/promises");

const Application = require("../models/Application");
const Student = require("../models/student");
const uploadResume = require("../Middleware/ResumeUpload");
const adminAuth = require("../Middleware/AdminAuth");

const router = express.Router();

// Helper: Delete uploaded resume
async function removeUploadedResume(file) {
  if (!file?.path) return;

  try {
    await fs.unlink(file.path);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Resume cleanup error:", error.message);
    }
  }
}

// Helper: Send error response and clean up resume
async function rejectRequest(req, res, statusCode, payload) {
  await removeUploadedResume(req.file);
  return res.status(statusCode).json(payload);
}

// TEST: Check application routes
router.get("/test", (req, res) => {
  return res.status(200).json({
    message: "Application routes are working!",
  });
});

// GET: Fetch ALL applications for Admin Dashboard
// Protected: Only authenticated admins can access
router.get("/", adminAuth, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId")
      .sort({ appliedAt: -1 });

    return res.status(200).json({
      total: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Fetch all applications error:", error);

    return res.status(500).json({
      message: "Failed to fetch all applications",
      error: error.message,
    });
  }
});

// GET: Fetch applications for a specific student
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const applications = await Application.find({
      studentId: student._id,
    }).sort({ appliedAt: -1 });

    return res.status(200).json({
      total: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Fetch applications error:", error);

    return res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

// POST: Upload resume and create application
router.post(
  "/",
  (req, res, next) => {
    uploadResume.single("resume")(req, res, (uploadError) => {
      if (uploadError) {
        return res.status(400).json({
          message: uploadError.message || "Resume upload failed",
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      const {
        studentId,
        company,
        jobTitle,
        location,
        salary,
        fullName,
        email,
        phone,
        course,
        college,
        graduationYear,
        cgpa,
        skills,
        coverLetter,
      } = req.body || {};

      const requiredFields = {
        studentId,
        company,
        jobTitle,
        fullName,
        email,
        phone,
        course,
        college,
        graduationYear,
        cgpa,
        skills,
        coverLetter,
      };

      const missingFields = Object.entries(requiredFields)
        .filter(
          ([, value]) => value == null || String(value).trim() === ""
        )
        .map(([key]) => key);

      if (missingFields.length > 0) {
        return rejectRequest(req, res, 400, {
          message: "Please provide all required application fields.",
          missingFields,
        });
      }

      if (!mongoose.isValidObjectId(studentId)) {
        return rejectRequest(req, res, 400, {
          message: "Invalid student ID",
        });
      }

      const numericGraduationYear = Number(graduationYear);

      if (
        !Number.isInteger(numericGraduationYear) ||
        numericGraduationYear < 1900 ||
        numericGraduationYear > 2200
      ) {
        return rejectRequest(req, res, 400, {
          message: "Please provide a valid graduation year.",
        });
      }

      const numericCgpa = Number(cgpa);

      if (
        !Number.isFinite(numericCgpa) ||
        numericCgpa < 0 ||
        numericCgpa > 10
      ) {
        return rejectRequest(req, res, 400, {
          message: "CGPA must be between 0 and 10.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Please upload your resume (PDF, DOC, or DOCX).",
        });
      }

      const student = await Student.findById(studentId);

      if (!student) {
        return rejectRequest(req, res, 404, {
          message: "Student not found",
        });
      }

      const resumePath = path.posix.join(
        "/uploads/applications",
        req.file.filename
      );

      const application = await Application.create({
        studentId: student._id,
        company: company.trim(),
        jobTitle: jobTitle.trim(),
        location: (location || "Not specified").trim(),
        salary: (salary || "Not specified").trim(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        course: course.trim(),
        college: college.trim(),
        graduationYear: numericGraduationYear,
        cgpa: numericCgpa,
        skills: skills.trim(),
        coverLetter: coverLetter.trim(),
        resume: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: resumePath,
          mimetype: req.file.mimetype,
        },
        status: "Applied",
      });

      return res.status(201).json({
        message: "Application created successfully",
        application,
      });
    } catch (error) {
      console.error("Create application error:", error);

      await removeUploadedResume(req.file);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Application validation failed",
          error: error.message,
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          message: "A duplicate value was detected.",
        });
      }

      return res.status(500).json({
        message: "Failed to create application",
        error: error.message,
      });
    }
  }
);

// PATCH: Update application status
// Protected: Only authenticated admins can update status
router.patch(
  "/:applicationId/status",
  adminAuth,
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ];

      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({
          message: "Invalid application ID.",
        });
      }

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid application status.",
          allowedStatuses,
        });
      }

      const application = await Application.findByIdAndUpdate(
        applicationId,
        { $set: { status } },
        { new: true, runValidators: true }
      );

      if (!application) {
        return res.status(404).json({
          message: "Application not found.",
        });
      }

      return res.status(200).json({
        message: "Application status updated successfully.",
        application: {
          id: application._id,
          company: application.company,
          jobTitle: application.jobTitle,
          status: application.status,
        },
      });
    } catch (error) {
      console.error("Status update error:", error);

      return res.status(500).json({
        message: "Failed to update application status.",
      });
    }
  }
);

module.exports = router;
