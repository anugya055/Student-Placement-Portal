import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import { API_BASE_URL, SERVER_URL } from "../apiConfig";

const API_URL = `${API_BASE_URL}/auth`;

function Profile() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [studentId, setStudentId] = useState("");

  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    course: "",
    college: "",
    graduationYear: "",
    cgpa: "",
    github: "",
    linkedin: "",
    bio: "",
    resume: "",
  });

  const [skills, setSkills] = useState([]);

  // Convert a student record from MongoDB into frontend profile fields.
  const fillProfile = (student) => {
    const nameParts = (student.name || "").trim().split(/\s+/);

    setProfile({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" "),
      email: student.email || "",
      phone: student.phone || "",
      location: student.location || "",
      course: student.course || "",
      college: student.college || "",
      graduationYear: student.graduationYear ?? "",
      cgpa: student.cgpa ?? "",
      github: student.github || "",
      linkedin: student.linkedin || "",
      bio: student.bio || "",
      resume: student.resume || "",
    });

    setSkills(Array.isArray(student.skills) ? student.skills : []);
  };

  // Load the logged-in student's profile.
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const savedStudent = sessionStorage.getItem("student");

        if (!savedStudent) {
          throw new Error("Please log in to view your profile.");
        }

        const loggedInStudent = JSON.parse(savedStudent);
        const id = loggedInStudent.id || loggedInStudent._id;

        if (!id) {
          throw new Error("Student ID not found. Please log in again.");
        }

        setStudentId(id);

        const response = await fetch(
          `${API_URL}/profile/${id}`
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile.");
        }

        const student = data.student || data;

        if (!student || typeof student !== "object" || !student.name) {
          throw new Error(
            "Student details were not returned correctly by the backend."
          );
        }

        fillProfile(student);

        // Keep login details synchronized with the database record.
        sessionStorage.setItem(
          "student",
          JSON.stringify({
            ...loggedInStudent,
            id: student._id || id,
            name: student.name,
            email: student.email || "",
          })
        );
      } catch (err) {
        setError(
          err.message === "Failed to fetch"
            ? "Cannot connect to the server. Please check your backend."
            : err.message || "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Handle changes in form fields.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // Save the profile information to MongoDB.
  const handleSave = async () => {
    if (!studentId) {
      setError("Student ID is missing. Please log in again.");
      return;
    }

    if (!profile.firstName.trim() || !profile.email.trim()) {
      setError("First name and email are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const fullName =
        `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim();

      const response = await fetch(
        `${API_URL}/profile/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName,
            firstName: profile.firstName.trim(),
            lastName: profile.lastName.trim(),
            email: profile.email.trim(),
            phone: profile.phone,
            location: profile.location,
            course: profile.course,
            college: profile.college,
            graduationYear: profile.graduationYear,
            cgpa: profile.cgpa,
            github: profile.github,
            linkedin: profile.linkedin,
            bio: profile.bio,
            skills,
            resume: profile.resume,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to save profile.");
      }

      const student = data.student || data;

      if (!student || typeof student !== "object" || !student.name) {
        throw new Error(
          "The backend did not return the updated student details."
        );
      }

      fillProfile(student);

      const savedStudent = sessionStorage.getItem("student");
      const loggedInStudent = savedStudent
        ? JSON.parse(savedStudent)
        : {};

      sessionStorage.setItem(
        "student",
        JSON.stringify({
          ...loggedInStudent,
          id: student._id || studentId,
          name: student.name,
          email: student.email || "",
        })
      );

      setEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please check your backend."
          : err.message || "Unable to save profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // Upload a PDF resume to the backend.
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];

    // Allow the same file to be selected again.
    e.target.value = "";

    if (!file) return;

    setError("");
    setSuccess("");

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be 5 MB or smaller.");
      return;
    }

    if (!studentId) {
      setError("Student ID is missing. Please log in again.");
      return;
    }

    try {
      setUploadingResume(true);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(
        `${API_URL}/profile/${studentId}/resume`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Resume upload failed.");
      }

      const uploadedResume =
        data.resumeUrl || data.student?.resume;

      if (!uploadedResume) {
        throw new Error(
          "The server did not return the uploaded resume path."
        );
      }

      setProfile((previousProfile) => ({
        ...previousProfile,
        resume: uploadedResume,
      }));

      setSuccess("Resume uploaded successfully!");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please check your backend."
          : err.message || "Resume upload failed."
      );
    } finally {
      setUploadingResume(false);
    }
  };

  // Log out the current student.
  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("student");
    window.location.href = "/login";
  };

  // Add a new skill.
  const handleAddSkill = () => {
    const newSkill = window.prompt("Enter a skill:");

    if (newSkill && newSkill.trim()) {
      const cleanedSkill = newSkill.trim();

      if (
        !skills.some(
          (skill) =>
            skill.toLowerCase() === cleanedSkill.toLowerCase()
        )
      ) {
        setSkills((previousSkills) => [
          ...previousSkills,
          cleanedSkill,
        ]);

        setError("");
        setSuccess("");
      }
    }
  };

  // Build the uploaded resume URL.
  const getResumeUrl = () => {
    if (!profile.resume) return "";

    if (
      profile.resume.startsWith("http://") ||
      profile.resume.startsWith("https://")
    ) {
      return profile.resume;
    }

    return `${SERVER_URL}${
      profile.resume.startsWith("/")
        ? profile.resume
        : `/${profile.resume}`
    }`;
  };

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Student";

  const completionFields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.phone,
    profile.location,
    profile.course,
    profile.college,
    profile.graduationYear,
    profile.cgpa,
    skills.length ? "skills" : "",
    profile.github,
    profile.linkedin,
    profile.bio,
  ];

  const completion = Math.round(
    (completionFields.filter(
      (value) => String(value ?? "").trim()
    ).length /
      completionFields.length) *
      100
  );

  return (
    <div className="profile-page">
      {/* SIDEBAR */}
      <aside className="profile-sidebar">
        <div className="profile-logo">
          🎓 <span>PlacementHub</span>
        </div>

        <nav className="profile-menu">
          <a href="/dashboard" className="profile-menu-item">
            <span>📊</span>
            Dashboard
          </a>

          <a href="/profile" className="profile-menu-item active">
            <span>👤</span>
            My Profile
          </a>

          <a href="/jobs" className="profile-menu-item">
            <span>💼</span>
            Job Opportunities
          </a>

          <a href="/applications" className="profile-menu-item">
            <span>📄</span>
            My Applications
          </a>

          <a href="/interviews" className="profile-menu-item">
            <span>📅</span>
            Interviews
          </a>

          <a href="/preparation" className="profile-menu-item">
            <span>🎯</span>
            Preparation
          </a>

          <a href="/notifications" className="profile-menu-item">
            <span>🔔</span>
            Notifications
            <span className="profile-notification">3</span>
          </a>
        </nav>

        <div className="profile-sidebar-bottom">
          <a href="/settings" className="profile-menu-item">
            <span>⚙️</span>
            Settings
          </a>

          <a
            href="/login"
            onClick={handleLogout}
            className="profile-menu-item profile-logout"
          >
            <span>🚪</span>
            Logout
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="profile-main">
        <header className="profile-navbar">
          <div>
            <h2>My Profile</h2>
            <p>Manage your personal and academic information</p>
          </div>

          <div className="profile-navbar-user">
            <div className="profile-avatar">
              {profile.firstName.charAt(0).toUpperCase() || "S"}
            </div>

            <div>
              <strong>{fullName}</strong>
              <small>Student</small>
            </div>
          </div>
        </header>

        <div className="profile-content">
          {loading && <p>Loading your profile...</p>}

          {error && (
            <p
              role="alert"
              style={{ color: "#ff6b6b", marginBottom: "16px" }}
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              style={{ color: "#20c997", marginBottom: "16px" }}
            >
              {success}
            </p>
          )}

          {!loading && !error && (
            <>
              {/* PROFILE HEADER */}
              <section className="profile-header-card">
                <div className="profile-large-avatar">
                  {profile.firstName.charAt(0).toUpperCase() || "S"}
                </div>

                <div className="profile-header-info">
                  <h1>{fullName}</h1>
                  <p>{profile.course || "Student"} Student</p>
                  <span>
                    📍 {profile.location || "Location not added"}
                  </span>
                </div>

                <div className="profile-header-action">
                  {!editing ? (
                    <button
                      type="button"
                      className="edit-profile-btn"
                      onClick={() => {
                        setEditing(true);
                        setSuccess("");
                        setError("");
                      }}
                    >
                      ✏️ Edit Profile
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="save-profile-btn"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "✓ Save Changes"}
                    </button>
                  )}
                </div>
              </section>

              {/* PROFILE COMPLETION */}
              <section className="completion-card">
                <div className="completion-info">
                  <div>
                    <h3>Profile Completion</h3>
                    <p>
                      Complete your profile to improve your placement
                      opportunities.
                    </p>
                  </div>

                  <strong>{completion}%</strong>
                </div>

                <div className="completion-bar">
                  <div style={{ width: `${completion}%` }} />
                </div>

                <div className="completion-tasks">
                  <span className={profile.phone ? "done" : ""}>
                    {profile.phone ? "✓" : "○"} Personal Information
                  </span>

                  <span className={profile.college ? "done" : ""}>
                    {profile.college ? "✓" : "○"} Education
                  </span>

                  <span className={skills.length ? "done" : ""}>
                    {skills.length ? "✓" : "○"} Skills
                  </span>

                  <span
                    className={
                      profile.github && profile.linkedin ? "done" : ""
                    }
                  >
                    {profile.github && profile.linkedin ? "✓" : "○"} Social
                    Links
                  </span>

                  <span className={profile.resume ? "done" : ""}>
                    {profile.resume ? "✓ Resume Added" : "○ Upload Resume"}
                  </span>
                </div>
              </section>

              {/* PERSONAL INFORMATION */}
              <section className="profile-section">
                <div className="section-heading">
                  <div>
                    <h2>Personal Information</h2>
                    <p>Your basic personal details</p>
                  </div>
                  <span>👤</span>
                </div>

                <div className="profile-form-grid">
                  <div className="profile-field">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>

                  <div className="profile-field">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>

                  <div className="profile-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>

                  <div className="profile-field">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>

                  <div className="profile-field">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </section>

              {/* EDUCATION */}
              <section className="profile-section">
                <div className="section-heading">
                  <div>
                    <h2>Education</h2>
                    <p>Your academic qualifications</p>
                  </div>
                  <span>🎓</span>
                </div>

                <div className="education-card">
                  <div className="education-icon">🎓</div>

                  <div className="education-details">
                    <h3>{profile.course || "Course not added"}</h3>
                    <p>{profile.college || "College not added"}</p>
                    <span>
                      {profile.graduationYear || "Year not added"} • CGPA:{" "}
                      {profile.cgpa || "Not added"}
                    </span>
                  </div>
                </div>

                {editing && (
                  <div className="profile-form-grid education-form">
                    <div className="profile-field">
                      <label>Course</label>
                      <input
                        type="text"
                        name="course"
                        value={profile.course}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="profile-field">
                      <label>Graduation Year</label>
                      <input
                        type="number"
                        name="graduationYear"
                        value={profile.graduationYear}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="profile-field">
                      <label>College / University</label>
                      <input
                        type="text"
                        name="college"
                        value={profile.college}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="profile-field">
                      <label>CGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        name="cgpa"
                        value={profile.cgpa}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* SKILLS */}
              <section className="profile-section">
                <div className="section-heading">
                  <div>
                    <h2>Skills</h2>
                    <p>Technical skills and expertise</p>
                  </div>
                  <span>💻</span>
                </div>

                <div className="skills-container">
                  {skills.map((skill, index) => (
                    <span className="skill-tag" key={`${skill}-${index}`}>
                      {skill}

                      {editing && (
                        <button
                          type="button"
                          onClick={() => {
                            setSkills((previousSkills) =>
                              previousSkills.filter((_, i) => i !== index)
                            );
                            setSuccess("");
                            setError("");
                          }}
                          aria-label={`Remove ${skill}`}
                          style={{
                            marginLeft: "8px",
                            background: "transparent",
                            border: "none",
                            color: "inherit",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {editing && (
                  <button
                    type="button"
                    className="add-skill-btn"
                    onClick={handleAddSkill}
                  >
                    + Add Skill
                  </button>
                )}
              </section>

              {/* ABOUT ME */}
              <section className="profile-section">
                <div className="section-heading">
                  <div>
                    <h2>About Me</h2>
                    <p>Tell recruiters about yourself</p>
                  </div>
                  <span>✨</span>
                </div>

                <textarea
                  className="bio-input"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  rows="5"
                />
              </section>

              {/* SOCIAL LINKS */}
              <section className="profile-section">
                <div className="section-heading">
                  <div>
                    <h2>Professional Links</h2>
                    <p>Connect your professional profiles</p>
                  </div>
                  <span>🔗</span>
                </div>

                <div className="profile-form-grid">
                  <div className="profile-field">
                    <label>GitHub</label>
                    <input
                      type="text"
                      name="github"
                      value={profile.github}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>

                  <div className="profile-field">
                    <label>LinkedIn</label>
                    <input
                      type="text"
                      name="linkedin"
                      value={profile.linkedin}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </section>

              {/* RESUME UPLOAD */}
              <section className="profile-section">
                <div className="section-heading">
                  <div>
                    <h2>Resume</h2>
                    <p>Upload your latest resume</p>
                  </div>
                  <span>📄</span>
                </div>

                <div className="resume-upload">
                  <div className="resume-icon">📄</div>

                  <div>
                    <h3>
                      {profile.resume ? "Resume added" : "Upload Resume"}
                    </h3>
                    <p>PDF format • Maximum 5 MB</p>

                    {profile.resume && (
                      <a
                        href={getResumeUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View uploaded resume
                      </a>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeUpload}
                    hidden
                  />

                  <button
                    type="button"
                    disabled={uploadingResume}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadingResume
                      ? "Uploading..."
                      : profile.resume
                        ? "Replace Resume"
                        : "Choose File"}
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;