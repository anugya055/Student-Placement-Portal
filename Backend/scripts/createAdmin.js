
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");

async function createAdmin() {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } =
      process.env;

    if (!MONGO_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Please configure all required environment variables.");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must contain at least 12 characters.");
    }

    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully.");

    const email = ADMIN_EMAIL.trim().toLowerCase();

    const existingUser = await Student.findOne({ email });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log("This admin account already exists.");
      } else {
        console.log("This email belongs to an existing student.");
        console.log("No changes were made to the student account.");
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await Student.create({
      name: ADMIN_NAME.trim(),
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully!");
    console.log("Admin email:", email);

  } catch (error) {
    console.error("Admin creation failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
