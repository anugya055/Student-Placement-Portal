
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Internship"],
      required: true,
    },

    eligibility: {
      type: String,
      required: true,
    },

    lastDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
