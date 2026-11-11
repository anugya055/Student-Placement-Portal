
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ApplicationForm.css";

function ApplicationForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get job data from JobDetails page
  const job = location.state?.job;

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: "",
    college: "",
    graduationYear: "",
    cgpa: "",
    skills: "",
    coverLetter: "",
  });

  const [resume, setResume] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle resume selection
  const handleResumeChange = (e) => {
    const file = e.target.files?.[0] || null;

    setSubmitError("");
    setResume(null);

    if (!file) return;

    const allowedExtensions = /\.(pdf|doc|docx)$/i;

    if (!allowedExtensions.test(file.name)) {
      setSubmitError("Please select a PDF, DOC, or DOCX resume.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError("Resume size must not exceed 5 MB.");
      e.target.value = "";
      return;
    }

    setResume(file);
  };

  // Submit complete application and resume to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!job) {
      setSubmitError("Please select a job before applying.");
      return;
    }

    // Get logged-in student
    let student;

    try {
      student = JSON.parse(sessionStorage.getItem("student") || "null");
    } catch {
      student = null;
    }

    if (!student || !(student.id || student._id)) {
      setSubmitError("Please log in before submitting your application.");
      return;
    }

    if (!resume) {
      setSubmitError("Please upload your resume.");
      return;
    }

    // Validate graduation year
    const graduationYear = Number(formData.graduationYear);

    if (
      !Number.isInteger(graduationYear) ||
      graduationYear < 1900 ||
      graduationYear > 2200
    ) {
      setSubmitError("Please enter a valid graduation year.");
      return;
    }

    // Validate CGPA
    const cgpa = Number(formData.cgpa);

    if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10) {
      setSubmitError("CGPA must be between 0 and 10.");
      return;
    }

    setSubmitting(true);

    try {
      // FormData sends text fields and the resume file together
      const body = new FormData();

      body.append("studentId", student.id || student._id);
      body.append("company", job.company || "Company");
      body.append("jobTitle", job.role || "Job Position");
      body.append("location", job.location || "Not specified");
      body.append("salary", job.salary || "Not specified");

      Object.entries(formData).forEach(([key, value]) => {
        body.append(key, value);
      });

      body.append("resume", resume);

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          body,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const missingFields = data.missingFields?.length
          ? ` Missing fields: ${data.missingFields.join(", ")}.`
          : "";

        throw new Error(
          (data.message || "Failed to submit application.") +
            missingFields
        );
      }

      console.log("Application saved:", data.application);
      setSubmitted(true);
    } catch (error) {
      console.error("Application submission error:", error);

      setSubmitError(
        error.message ||
          "Unable to submit your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // If no job was selected
  if (!job) {
    return (
      <div className="job-details-error">
        <div className="error-icon">📄</div>

        <h2>No Job Selected</h2>

        <p>
          Please select a job from the Job Opportunities page
          before applying.
        </p>

        <button onClick={() => navigate("/jobs")}>
          ← Browse Jobs
        </button>
      </div>
    );
  }

  // Success screen
  if (submitted) {
    return (
      <div className="application-success">
        <div className="success-icon">✓</div>

        <h1>Application Submitted!</h1>

        <p>
          Your application for{" "}
          <strong>{job.role || "Job Position"}</strong> at{" "}
          <strong>{job.company || "Company"}</strong> has been
          submitted successfully.
        </p>

        <div className="success-buttons">
          <button onClick={() => navigate("/applications")}>
            View My Applications
          </button>

          <button onClick={() => navigate("/jobs")}>
            Browse More Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-page">
      {/* Sidebar */}
      <aside className="application-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🎓</div>

          <h2>
            Placement<span>Portal</span>
          </h2>
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => navigate("/dashboard")}>
            🏠 Dashboard
          </button>

          <button onClick={() => navigate("/profile")}>
            👤 My Profile
          </button>

          <button onClick={() => navigate("/jobs")}>
            💼 Job Opportunities
          </button>

          <button onClick={() => navigate("/applications")}>
            📋 My Applications
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            onClick={() => {
              sessionStorage.removeItem("student");
              navigate("/");
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="application-main">
        {/* Header */}
        <div className="application-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h1>Job Application</h1>

          <p>
            Complete the form below to apply for this position.
          </p>
        </div>

        {/* Selected Job */}
        <div className="selected-job-card">
          <div className="selected-job-logo">
            {job.company ? job.company.charAt(0) : "C"}
          </div>

          <div className="selected-job-info">
            <h2>{job.role || "Job Position"}</h2>

            <p>{job.company || "Company"}</p>

            <div className="selected-job-details">
              <span>📍 {job.location || "Not specified"}</span>

              <span>💰 {job.salary || "Not specified"}</span>

              {job.experience && (
                <span>💼 {job.experience}</span>
              )}
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form className="application-form" onSubmit={handleSubmit}>
          {submitError && (
            <p
              role="alert"
              style={{
                color: "#b91c1c",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              {submitError}
            </p>
          )}

          {/* Personal Information */}
          <section className="form-section">
            <div className="form-section-title">
              <h2>Personal Information</h2>
              <p>Enter your basic personal details.</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="form-section">
            <div className="form-section-title">
              <h2>Education Details</h2>
              <p>Provide your academic information.</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="course">Course *</label>

                <input
                  id="course"
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. MCA"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="college">College / University *</label>

                <input
                  id="college"
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="graduationYear">Graduation Year *</label>

                <input
                  id="graduationYear"
                  type="number"
                  name="graduationYear"
                  min="1900"
                  max="2200"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="2027"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cgpa">CGPA (out of 10) *</label>

                <input
                  id="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 9.17"
                  required
                />
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="form-section">
            <div className="form-section-title">
              <h2>Skills</h2>
              <p>Mention your technical skills.</p>
            </div>

            <div className="form-group">
              <label htmlFor="skills">Technical Skills *</label>

              <input
                id="skills"
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Java, React, JavaScript, MongoDB..."
                required
              />
            </div>
          </section>

          {/* Resume */}
          <section className="form-section">
            <div className="form-section-title">
              <h2>Resume</h2>
              <p>Upload your latest resume.</p>
            </div>

            <div className="resume-upload">
              <label htmlFor="resume">📄 Choose Resume</label>

              <input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                required
              />

              {resume && (
                <p className="resume-name">
                  Selected: {resume.name}
                </p>
              )}
            </div>
          </section>

          {/* Cover Letter */}
          <section className="form-section">
            <div className="form-section-title">
              <h2>Cover Letter</h2>

              <p>
                Tell the recruiter why you are suitable for
                this position.
              </p>
            </div>

            <div className="form-group">
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                placeholder="Write your cover letter..."
                rows="6"
                required
              />
            </div>
          </section>

          {/* Submit */}
          <div className="form-submit">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/jobs")}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Application →"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ApplicationForm;
