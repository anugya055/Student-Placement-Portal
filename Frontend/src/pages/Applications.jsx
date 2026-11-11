import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Applications.css";

function Applications() {
  const navigate = useNavigate();

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const storedStudent = sessionStorage.getItem("student");

        if (!storedStudent) {
          setError("Please log in to view your applications.");
          return;
        }

        const student = JSON.parse(storedStudent);
        const studentId = student.id || student._id;

        if (!studentId) {
          setError("Student ID not found. Please log in again.");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/applications/${studentId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load applications.");
        }

        const applicationList = Array.isArray(data)
          ? data
          : data.applications || [];

        const formattedApplications = applicationList.map((app) => ({
          id: app._id || app.id,
          role: app.jobTitle || app.role || "Job Title Not Available",
          company: app.company || "Company Not Available",
          location: app.location || "Not specified",
          salary: app.salary || "Not specified",
          appliedDate: app.appliedAt
            ? new Date(app.appliedAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Date not available",
          status: app.status || "Applied",
          applicant: {
            fullName: app.fullName || "",
            email: app.email || "",
            phone: app.phone || "",
            course: app.course || "",
            college: app.college || "",
            graduationYear:
              app.graduationYear !== undefined && app.graduationYear !== null
                ? String(app.graduationYear)
                : "",
            cgpa:
              app.cgpa !== undefined && app.cgpa !== null
                ? String(app.cgpa)
                : "",
            skills: Array.isArray(app.skills)
              ? app.skills.join(", ")
              : app.skills || "",
            coverLetter: app.coverLetter || "",
          },
        }));

        setApplications(formattedApplications);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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
      {/* Sidebar */}
      <aside className="applications-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🎓</div>
          <h2>
            Placement<span>Portal</span>
          </h2>
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
          <button onClick={() => navigate("/profile")}>👤 My Profile</button>
          <button onClick={() => navigate("/jobs")}>💼 Job Opportunities</button>
          <button className="active">📋 My Applications</button>
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
      <main className="applications-main">
        <div className="applications-header">
          <h1>My Applications</h1>
          <p>Track all your job applications and their current status.</p>
        </div>

        {/* Application Cards */}
        <div className="applications-list">
          {loading ? (
            <p>Loading your applications...</p>
          ) : error ? (
            <div className="application-card">
              <div className="application-info">
                <h2>Unable to load applications</h2>
                <p role="alert">{error}</p>
                <button
                  className="view-btn"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="application-card">
              <div className="application-info">
                <h2>No applications yet</h2>
                <p>You have not applied for any jobs yet.</p>
                <p>Browse available jobs to get started.</p>
              </div>
            </div>
          ) : (
            applications.map((application) => (
              <div className="application-card" key={application.id}>
                {/* Company Logo */}
                <div className="application-company-logo">
                  {application.company.charAt(0)}
                </div>

                {/* Job Information */}
                <div className="application-info">
                  <h2>{application.role}</h2>
                  <h3>{application.company}</h3>
                  <div className="application-meta">
                    <span>📍 {application.location}</span>
                    <span>💰 {application.salary}</span>
                    <span>📅 Applied {application.appliedDate}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="application-status">
                  <span
                    className={`status-badge ${application.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
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
            ))
          )}
        </div>

        {/* Browse Jobs */}
        <div className="applications-footer">
          <button
            className="browse-jobs-btn"
            onClick={() => navigate("/jobs")}
          >
            Browse More Jobs →
          </button>
        </div>
      </main>

      {/* Application Details Popup */}
      {selectedApplication && (
        <div className="application-modal-overlay" onClick={handleClose}>
          <div
            className="application-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h2>Application Details</h2>
                <p>View your submitted application</p>
              </div>
              <button className="modal-close" onClick={handleClose}>
                ×
              </button>
            </div>

            {/* Job Information */}
            <div className="modal-job">
              <div className="modal-company-logo">
                {selectedApplication.company.charAt(0)}
              </div>
              <div>
                <h3>{selectedApplication.role}</h3>
                <p>{selectedApplication.company}</p>
              </div>
            </div>

            {/* Status */}
            <div className="modal-status-row">
              <span>Application Status</span>
              <span
                className={`status-badge ${selectedApplication.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {selectedApplication.status}
              </span>
            </div>

            {/* Job Details */}
            <div className="modal-section">
              <h3>Job Information</h3>
              <div className="modal-grid">
                <div>
                  <span>Location</span>
                  <strong>{selectedApplication.location}</strong>
                </div>
                <div>
                  <span>Salary</span>
                  <strong>{selectedApplication.salary}</strong>
                </div>
                <div>
                  <span>Applied Date</span>
                  <strong>{selectedApplication.appliedDate}</strong>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="modal-section">
              <h3>Personal Information</h3>
              <div className="modal-grid">
                <div>
                  <span>Full Name</span>
                  <strong>{selectedApplication.applicant.fullName || "Not provided"}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{selectedApplication.applicant.email || "Not provided"}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{selectedApplication.applicant.phone || "Not provided"}</strong>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="modal-section">
              <h3>Education</h3>
              <div className="modal-grid">
                <div>
                  <span>Course</span>
                  <strong>{selectedApplication.applicant.course || "Not provided"}</strong>
                </div>
                <div>
                  <span>College</span>
                  <strong>{selectedApplication.applicant.college || "Not provided"}</strong>
                </div>
                <div>
                  <span>Graduation Year</span>
                  <strong>{selectedApplication.applicant.graduationYear || "Not provided"}</strong>
                </div>
                <div>
                  <span>CGPA</span>
                  <strong>{selectedApplication.applicant.cgpa || "Not provided"}</strong>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="modal-section">
              <h3>Skills</h3>
              <div className="modal-skills">
                {selectedApplication.applicant.skills
                  .split(",")
                  .map((skill, index) => skill.trim() && (
                    <span className="modal-skill" key={index}>
                      {skill.trim()}
                    </span>
                  ))}
                {!selectedApplication.applicant.skills.trim() && (
                  <span>Not provided</span>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="modal-section">
              <h3>Cover Letter</h3>
              <p className="modal-cover-letter">
                {selectedApplication.applicant.coverLetter || "No cover letter provided."}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="modal-close-btn" onClick={handleClose}>
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
