
const express = require("express");
const mongoose = require("mongoose");

const Job = require("../models/Job");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// GET: Fetch all active jobs for students
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Active" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Active jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
});

// GET: Fetch all jobs for admin
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "All jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
});

// POST: Add a new job (Admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      companyName,
      jobTitle,
      description,
      skills,
      location,
      salary,
      jobType,
      eligibility,
      lastDate,
    } = req.body;

    if (
      !companyName ||
      !jobTitle ||
      !description ||
      !Array.isArray(skills) ||
      skills.length === 0 ||
      !location ||
      !salary ||
      !jobType ||
      !eligibility ||
      !lastDate
    ) {
      return res.status(400).json({
        message: "Please provide all required job details.",
      });
    }

    const job = await Job.create({
      companyName,
      jobTitle,
      description,
      skills,
      location,
      salary,
      jobType,
      eligibility,
      lastDate,
      postedBy: req.admin.id,
    });

    res.status(201).json({
      message: "Job opening created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create job",
      error: error.message,
    });
  }
});

// PUT: Update job details (Admin only)
router.put("/:jobId", adminAuth, async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    const allowedFields = [
      "companyName",
      "jobTitle",
      "description",
      "skills",
      "location",
      "salary",
      "jobType",
      "eligibility",
      "lastDate",
      "status",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update job",
      error: error.message,
    });
  }
});

// DELETE: Delete a job (Admin only)
router.delete("/:jobId", adminAuth, async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete job",
      error: error.message,
    });
  }
});

// GET: Fetch one job by ID
router.get("/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findOne({
      _id: jobId,
      status: "Active",
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or no longer active.",
      });
    }

    res.status(200).json({
      message: "Job fetched successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job",
      error: error.message,
    });
  }
});

module.exports = router;
