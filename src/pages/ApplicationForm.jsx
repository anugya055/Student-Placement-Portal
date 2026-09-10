import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ApplicationForm.css";

function ApplicationForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get job data from JobDetails page
  const job = location.state?.job;

  const [submitted, setSubmitted] = useState(false);

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

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle resume
  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  // Submit application
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!job) {
      alert("Please select a job first.");
      navigate("/jobs");
      return;
    }

    const newApplication = {
      id: Date.now(),

      role: job.role || "Job Position",
      company: job.company || "Company",
      location: job.location || "Not specified",
      salary: job.salary || "Not specified",

      appliedDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      status: "Under Review",

      applicant: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        college: formData.college,
        graduationYear: formData.graduationYear,
        cgpa: formData.cgpa,
        skills: formData.skills,
        coverLetter: formData.coverLetter,
      },
    };

    // Get old applications
    const existingApplications =
      JSON.parse(localStorage.getItem("applications")) || [];

    // Add new application
    existingApplications.push(newApplication);

    // Save applications
    localStorage.setItem(
      "applications",
      JSON.stringify(existingApplications)
    );

    console.log("Application Saved:", newApplication);

    setSubmitted(true);
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

        <div className="success-icon">
          ✓
        </div>

        <h1>Application Submitted!</h1>

        <p>
          Your application for{" "}
          <strong>{job.role}</strong> at{" "}
          <strong>{job.company}</strong> has been submitted
          successfully.
        </p>

        <div className="success-buttons">

          <button
            onClick={() => navigate("/applications")}
          >
            View My Applications
          </button>

          <button
            onClick={() => navigate("/jobs")}
          >
            Browse More Jobs
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="application-page">

      {/* =========================
          Sidebar
      ========================== */}

      <aside className="application-sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">
            🎓
          </div>

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

          <button
            onClick={() => navigate("/applications")}
          >
            📋 My Applications
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button onClick={() => navigate("/")}>
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* =========================
          Main Content
      ========================== */}

      <main className="application-main">

        {/* Header */}

        <div className="application-header">

          <button
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
            {job.company
              ? job.company.charAt(0)
              : "C"}
          </div>

          <div className="selected-job-info">

            <h2>
              {job.role || "Job Position"}
            </h2>

            <p>
              {job.company || "Company"}
            </p>

            <div className="selected-job-details">

              <span>
                📍 {job.location || "Not specified"}
              </span>

              <span>
                💰 {job.salary || "Not specified"}
              </span>

              {job.experience && (
                <span>
                  💼 {job.experience}
                </span>
              )}

            </div>

          </div>

        </div>


        {/* Application Form */}

        <form
          className="application-form"
          onSubmit={handleSubmit}
        >

          {/* Personal Information */}

          <section className="form-section">

            <div className="form-section-title">
              <h2>Personal Information</h2>

              <p>
                Enter your basic personal details.
              </p>
            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Phone Number *
                </label>

                <input
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

              <p>
                Provide your academic information.
              </p>

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Course *
                </label>

                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. MCA"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  College / University *
                </label>

                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Graduation Year *
                </label>

                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="2027"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  CGPA *
                </label>

                <input
                  type="number"
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

              <p>
                Mention your technical skills.
              </p>

            </div>


            <div className="form-group">

              <label>
                Technical Skills *
              </label>

              <input
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

              <p>
                Upload your latest resume.
              </p>

            </div>


            <div className="resume-upload">

              <label htmlFor="resume">
                📄 Choose Resume
              </label>

              <input
                id="resume"
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
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
            >
              Submit Application →
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default ApplicationForm;