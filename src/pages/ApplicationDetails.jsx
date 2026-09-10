import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ApplicationDetails.css";

function ApplicationDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get application data from My Applications page
  const application = location.state?.application;

  // If application is not selected
  if (!application) {
    return (
      <div className="application-details-error">
        <div className="error-icon">📄</div>

        <h2>No Application Selected</h2>

        <p>
          Please select an application from My Applications.
        </p>

        <button onClick={() => navigate("/applications")}>
          ← My Applications
        </button>
      </div>
    );
  }

  const applicant = application.applicant || {};

  return (
    <div className="application-details-page">

      {/* =========================
          Sidebar
      ========================== */}

      <aside className="application-details-sidebar">

        {/* Logo */}
        <div className="details-sidebar-logo">

          <div className="details-logo-icon">
            🎓
          </div>

          <h2>
            Placement<span>Portal</span>
          </h2>

        </div>

        {/* Navigation */}
        <nav className="details-sidebar-menu">

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
            className="active"
            onClick={() => navigate("/applications")}
          >
            📋 My Applications
          </button>

        </nav>

        {/* Logout */}
        <div className="details-sidebar-bottom">

          <button onClick={() => navigate("/")}>
            🚪 Logout
          </button>

        </div>

      </aside>


      {/* =========================
          Main Content
      ========================== */}

      <main className="application-details-main">

        {/* Header */}
        <div className="application-details-header">

          <button
            className="details-back-btn"
            onClick={() => navigate("/applications")}
          >
            ← Back to My Applications
          </button>

          <h1>Application Details</h1>

          <p>
            View the details of your submitted application.
          </p>

        </div>


        {/* =========================
            Job Information
        ========================== */}

        <section className="details-card job-summary">

          <div className="job-details-logo">
            {application.company
              ? application.company.charAt(0)
              : "C"}
          </div>

          <div className="job-summary-info">

            <h2>
              {application.role || "Job Position"}
            </h2>

            <h3>
              {application.company || "Company"}
            </h3>

            <div className="job-summary-meta">

              <span>
                📍 {application.location || "Not specified"}
              </span>

              <span>
                💰 {application.salary || "Not specified"}
              </span>

              <span>
                📅 Applied {application.appliedDate || "N/A"}
              </span>

            </div>

          </div>

          <div className="details-status">

            <span
              className={`details-status-badge ${
                application.status
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")
              }`}
            >
              {application.status || "Under Review"}
            </span>

          </div>

        </section>


        {/* =========================
            Application Status
        ========================== */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>Application Status</h2>

            <p>
              Current status of your application
            </p>

          </div>

          <div className="status-timeline">

            <div className="timeline-item completed">

              <div className="timeline-icon">
                ✓
              </div>

              <div>
                <h3>Application Submitted</h3>

                <p>
                  Your application has been submitted successfully.
                </p>
              </div>

            </div>


            <div
              className={`timeline-item ${
                application.status === "Under Review" ||
                application.status === "Shortlisted" ||
                application.status === "Selected"
                  ? "completed"
                  : ""
              }`}
            >

              <div className="timeline-icon">
                {application.status === "Under Review" ||
                application.status === "Shortlisted" ||
                application.status === "Selected"
                  ? "✓"
                  : "2"}
              </div>

              <div>
                <h3>Under Review</h3>

                <p>
                  Recruiter is reviewing your application.
                </p>
              </div>

            </div>


            <div
              className={`timeline-item ${
                application.status === "Shortlisted" ||
                application.status === "Selected"
                  ? "completed"
                  : ""
              }`}
            >

              <div className="timeline-icon">
                {application.status === "Shortlisted" ||
                application.status === "Selected"
                  ? "✓"
                  : "3"}
              </div>

              <div>
                <h3>Shortlisted</h3>

                <p>
                  You will be notified if you are shortlisted.
                </p>
              </div>

            </div>


            <div
              className={`timeline-item ${
                application.status === "Selected"
                  ? "completed"
                  : ""
              }`}
            >

              <div className="timeline-icon">
                {application.status === "Selected"
                  ? "✓"
                  : "4"}
              </div>

              <div>
                <h3>Selected</h3>

                <p>
                  Final selection status will be updated here.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* =========================
            Personal Information
        ========================== */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>Personal Information</h2>

            <p>
              Information submitted with your application
            </p>

          </div>


          <div className="details-grid">

            <div className="detail-item">

              <span>Full Name</span>

              <strong>
                {applicant.fullName || "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>Email</span>

              <strong>
                {applicant.email || "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>Phone</span>

              <strong>
                {applicant.phone || "Not provided"}
              </strong>

            </div>

          </div>

        </section>


        {/* =========================
            Education
        ========================== */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>Education Details</h2>

            <p>
              Academic information submitted with your application
            </p>

          </div>


          <div className="details-grid">

            <div className="detail-item">

              <span>Course</span>

              <strong>
                {applicant.course || "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>College / University</span>

              <strong>
                {applicant.college || "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>Graduation Year</span>

              <strong>
                {applicant.graduationYear || "Not provided"}
              </strong>

            </div>


            <div className="detail-item">

              <span>CGPA</span>

              <strong>
                {applicant.cgpa || "Not provided"}
              </strong>

            </div>

          </div>

        </section>


        {/* =========================
            Skills
        ========================== */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>Technical Skills</h2>

            <p>
              Skills provided in your application
            </p>

          </div>

          <div className="skills-container">

            {applicant.skills
              ? applicant.skills.split(",").map((skill, index) => (
                  <span className="skill-tag" key={index}>
                    {skill.trim()}
                  </span>
                ))
              : (
                <p className="no-data">
                  No skills provided
                </p>
              )}

          </div>

        </section>


        {/* =========================
            Cover Letter
        ========================== */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>Cover Letter</h2>

            <p>
              Your submitted cover letter
            </p>

          </div>

          <div className="cover-letter">

            {applicant.coverLetter ? (
              <p>
                {applicant.coverLetter}
              </p>
            ) : (
              <p className="no-data">
                No cover letter provided.
              </p>
            )}

          </div>

        </section>


        {/* =========================
            Bottom Actions
        ========================== */}

        <div className="details-actions">

          <button
            className="back-applications-btn"
            onClick={() => navigate("/applications")}
          >
            ← Back to Applications
          </button>

          <button
            className="browse-jobs-details-btn"
            onClick={() => navigate("/jobs")}
          >
            Browse More Jobs →
          </button>

        </div>

      </main>

    </div>
  );
}

export default ApplicationDetails;