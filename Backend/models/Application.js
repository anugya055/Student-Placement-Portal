
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Link the application to the logged-in student
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    // Job details
    company: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "Not specified",
      trim: true,
    },

    salary: {
      type: String,
      default: "Not specified",
      trim: true,
    },

    // Applicant personal details
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Education details
    course: {
      type: String,
      required: true,
      trim: true,
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    graduationYear: {
      type: Number,
      required: true,
    },

    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    // Skills and cover letter
    skills: {
      type: String,
      required: true,
      trim: true,
    },

    coverLetter: {
      type: String,
      required: true,
      trim: true,
    },

    // Resume metadata; file upload will be configured in Step 2
    resume: {
      filename: {
        type: String,
        default: "",
      },
      path: {
        type: String,
        default: "",
      },
      originalName: {
        type: String,
        default: "",
      },
      mimetype: {
        type: String,
        default: "",
      },
    },

    // Application status
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    interviewDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);
