
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
   },
   phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    college: {
      type: String,
      default: "",
    },
    course: {
      type: String,
      default: "",
    },

    graduationYear: {
      type: Number,
    },

    cgpa: {
      type: Number,
    },

    skills: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
