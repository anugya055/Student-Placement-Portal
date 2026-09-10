import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Applications.css";

function Applications() {
  const navigate = useNavigate();

  const [selectedApplication, setSelectedApplication] = useState(null);

  // Sample application data
  const applications = [
    {
      id: 1,
      role: "Software Engineer",
      company: "TCS",
      location: "Pune, India",
      salary: "6 - 8 LPA",
      appliedDate: "06 Sep 2026",
      status: "Under Review",

      applicant: {
        fullName: "Anugya Trivedi",
        email: "anugya@example.com",
        phone: "9876543210",
        course: "MCA",
        college: "Pranveer Singh Institute of Technology",
        graduationYear: "2027",
        cgpa: "9.17",
        skills: "Java, React, JavaScript, MongoDB",
        coverLetter:
          "I am interested in this Software Engineer position and believe my technical skills and academic background make me a suitable candidate."
      }
    },

    {
      id: 2,
      role: "Frontend Developer",
      company: "Infosys",
      location: "Bangalore, India",
      salary: "5 - 7 LPA",
      appliedDate: "03 Sep 2026",
      status: "Shortlisted",

      applicant: {
        fullName: "Anugya Trivedi",
        email: "anugya@example.com",
        phone: "9876543210",
        course: "MCA",
        college: "Pranveer Singh Institute of Technology",
        graduationYear: "2027",
        cgpa: "9.17",
        skills: "React, JavaScript, HTML, CSS",
        coverLetter:
          "I am excited to apply for the Frontend Developer position."
      }
    }
  ];

  // Open popup
  const handleView = (application) => {
    setSelectedApplication(application);
  };

  // Close popup
  const handleClose = () => {
    setSelectedApplication(null);
  };

  return (
    <div className="applications-page">

      {/* =========================
          Sidebar
      ========================== */}

      <aside className="applications-sidebar">

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

          <button className="active">
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

      <main className="applications-main">

        <div className="applications-header">

          <h1>My Applications</h1>

          <p>
            Track all your job applications and their current status.
          </p>

        </div>


        {/* Application Cards */}

        <div className="applications-list">

          {applications.map((application) => (

            <div
              className="application-card"
              key={application.id}
            >

              {/* Company Logo */}

              <div className="application-company-logo">
                {application.company.charAt(0)}
              </div>


              {/* Job Information */}

              <div className="application-info">

                <h2>
                  {application.role}
                </h2>

                <h3>
                  {application.company}
                </h3>

                <div className="application-meta">

                  <span>
                    📍 {application.location}
                  </span>

                  <span>
                    💰 {application.salary}
                  </span>

                  <span>
                    📅 Applied {application.appliedDate}
                  </span>

                </div>

              </div>


              {/* Status */}

              <div className="application-status">

                <span
                  className={`status-badge ${
                    application.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                  }`}
                >
                  {application.status}
                </span>

              </div>


              {/* View Button */}

              <button
                className="view-btn"
                onClick={() => handleView(application)}
              >
                View →
              </button>

            </div>

          ))}

        </div>


        {/* =========================
            Browse Jobs
        ========================== */}

        <div className="applications-footer">

          <button
            className="browse-jobs-btn"
            onClick={() => navigate("/jobs")}
          >
            Browse More Jobs →
          </button>

        </div>

      </main>


      {/* =================================================
          APPLICATION DETAILS POPUP
      ================================================= */}

      {selectedApplication && (

        <div
          className="application-modal-overlay"
          onClick={handleClose}
        >

          <div
            className="application-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="modal-header">

              <div>

                <h2>
                  Application Details
                </h2>

                <p>
                  View your submitted application
                </p>

              </div>

              <button
                className="modal-close"
                onClick={handleClose}
              >
                ×
              </button>

            </div>


            {/* Job Information */}

            <div className="modal-job">

              <div className="modal-company-logo">
                {selectedApplication.company.charAt(0)}
              </div>

              <div>

                <h3>
                  {selectedApplication.role}
                </h3>

                <p>
                  {selectedApplication.company}
                </p>

              </div>

            </div>


            {/* Status */}

            <div className="modal-status-row">

              <span>
                Application Status
              </span>

              <span
                className={`status-badge ${
                  selectedApplication.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                }`}
              >
                {selectedApplication.status}
              </span>

            </div>


            {/* Job Details */}

            <div className="modal-section">

              <h3>
                Job Information
              </h3>

              <div className="modal-grid">

                <div>
                  <span>Location</span>
                  <strong>
                    {selectedApplication.location}
                  </strong>
                </div>

                <div>
                  <span>Salary</span>
                  <strong>
                    {selectedApplication.salary}
                  </strong>
                </div>

                <div>
                  <span>Applied Date</span>
                  <strong>
                    {selectedApplication.appliedDate}
                  </strong>
                </div>

              </div>

            </div>


            {/* Personal Information */}

            <div className="modal-section">

              <h3>
                Personal Information
              </h3>

              <div className="modal-grid">

                <div>
                  <span>Full Name</span>
                  <strong>
                    {selectedApplication.applicant.fullName}
                  </strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    {selectedApplication.applicant.email}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>
                    {selectedApplication.applicant.phone}
                  </strong>
                </div>

              </div>

            </div>


            {/* Education */}

            <div className="modal-section">

              <h3>
                Education
              </h3>

              <div className="modal-grid">

                <div>
                  <span>Course</span>
                  <strong>
                    {selectedApplication.applicant.course}
                  </strong>
                </div>

                <div>
                  <span>College</span>
                  <strong>
                    {selectedApplication.applicant.college}
                  </strong>
                </div>

                <div>
                  <span>Graduation Year</span>
                  <strong>
                    {selectedApplication.applicant.graduationYear}
                  </strong>
                </div>

                <div>
                  <span>CGPA</span>
                  <strong>
                    {selectedApplication.applicant.cgpa}
                  </strong>
                </div>

              </div>

            </div>


            {/* Skills */}

            <div className="modal-section">

              <h3>
                Skills
              </h3>

              <div className="modal-skills">

                {selectedApplication.applicant.skills
                  .split(",")
                  .map((skill, index) => (

                    <span
                      className="modal-skill"
                      key={index}
                    >
                      {skill.trim()}
                    </span>

                  ))}

              </div>

            </div>


            {/* Cover Letter */}

            <div className="modal-section">

              <h3>
                Cover Letter
              </h3>

              <p className="modal-cover-letter">
                {selectedApplication.applicant.coverLetter}
              </p>

            </div>


            {/* Modal Footer */}

            <div className="modal-footer">

              <button
                className="modal-close-btn"
                onClick={handleClose}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Applications;