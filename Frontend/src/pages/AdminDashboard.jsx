
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api/applications";
const JOBS_API_URL = "http://localhost:5000/api/jobs";
const SERVER_URL = "http://localhost:5000";

const ALLOWED_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

const EMPTY_JOB_FORM = {
  companyName: "",
  jobTitle: "",
  description: "",
  skills: "",
  location: "",
  salary: "",
  jobType: "Full-time",
  eligibility: "",
  lastDate: "",
  status: "Active",
};

// Handle unauthorized admin requests
function handleUnauthorized() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
  window.location.href = "/admin-login";
}

// Get admin authorization headers
function getAdminHeaders(additionalHeaders = {}) {
  const token = localStorage.getItem("adminToken");

  return {
    ...additionalHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function formatDate(date) {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getDateInputValue(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function AdminDashboard() {
  const navigate = useNavigate();

  // APPLICATION STATES
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusChanges, setStatusChanges] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState(null);

  // DASHBOARD TAB
  const [activeTab, setActiveTab] = useState("applications");

  // JOB STATES
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [jobFeedback, setJobFeedback] = useState("");

  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [savingJob, setSavingJob] = useState(false);

  const [jobForm, setJobForm] = useState(EMPTY_JOB_FORM);

  // =====================================
  // FETCH APPLICATIONS
  // =====================================

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: getAdminHeaders(),
        });

        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || `API Error: ${response.status}`
          );
        }

        if (!Array.isArray(data.applications)) {
          throw new Error("Invalid applications response.");
        }

        setApplications(data.applications);
      } catch (err) {
        console.error("Fetch Applications Error:", err);
        setError(err.message || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // =====================================
  // APPLICATION STATUS MANAGEMENT
  // =====================================

  const handleStatusChange = (applicationId, newStatus) => {
    setStatusChanges((prev) => ({
      ...prev,
      [applicationId]: newStatus,
    }));

    setFeedback((prev) => ({
      ...prev,
      [applicationId]: "",
    }));
  };

  const handleUpdateStatus = async (applicationId, currentStatus) => {
    const newStatus =
      statusChanges[applicationId] ?? currentStatus;

    if (!ALLOWED_STATUSES.includes(newStatus)) return;

    if (newStatus === currentStatus) {
      setFeedback((prev) => ({
        ...prev,
        [applicationId]: "Please select a different status.",
      }));
      return;
    }

    try {
      setUpdatingId(applicationId);

      setFeedback((prev) => ({
        ...prev,
        [applicationId]: "",
      }));

      const response = await fetch(
        `${API_URL}/${applicationId}/status`,
        {
          method: "PATCH",
          headers: getAdminHeaders({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update application status."
        );
      }

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status: data.application.status }
            : app
        )
      );

      setSelectedApplication((prev) =>
        prev?._id === applicationId
          ? { ...prev, status: data.application.status }
          : prev
      );

      setStatusChanges((prev) => {
        const updated = { ...prev };
        delete updated[applicationId];
        return updated;
      });

      setFeedback((prev) => ({
        ...prev,
        [applicationId]: "Status updated successfully!",
      }));
    } catch (err) {
      console.error("Update Status Error:", err);

      setFeedback((prev) => ({
        ...prev,
        [applicationId]: err.message || "Status update failed.",
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================
  // FETCH JOBS
  // =====================================

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      setJobsError("");

      const response = await fetch(`${JOBS_API_URL}/admin/all`, {
        method: "GET",
        headers: getAdminHeaders(),
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load jobs.");
      }

      // Supports either { jobs: [...] } or an array response
      const jobsList = Array.isArray(data)
        ? data
        : data.jobs;

      if (!Array.isArray(jobsList)) {
        throw new Error("Invalid jobs response from server.");
      }

      setJobs(jobsList);
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
      setJobsError(err.message || "Failed to load jobs.");
    } finally {
      setJobsLoading(false);
    }
  };

  // Fetch jobs when Manage Jobs tab opens
  useEffect(() => {
    if (activeTab === "jobs") {
      fetchJobs();
    }
  }, [activeTab]);

  // =====================================
  // JOB FORM HANDLING
  // =====================================

  const handleJobInputChange = (e) => {
    const { name, value } = e.target;

    setJobForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddJobForm = () => {
    setEditingJobId(null);
    setJobForm({ ...EMPTY_JOB_FORM });
    setJobFeedback("");
    setShowJobForm(true);
  };

  const handleEditJob = (job) => {
    setEditingJobId(job._id);

    setJobForm({
      companyName: job.companyName || "",
      jobTitle: job.jobTitle || "",
      description: job.description || "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : "",
      location: job.location || "",
      salary: job.salary || "",
      jobType: job.jobType || "Full-time",
      eligibility: job.eligibility || "",
      lastDate: getDateInputValue(job.lastDate),
      status: job.status || "Active",
    });

    setJobFeedback("");
    setShowJobForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeJobForm = () => {
    setShowJobForm(false);
    setEditingJobId(null);
    setJobForm({ ...EMPTY_JOB_FORM });
    setJobFeedback("");
  };

  // =====================================
  // ADD / UPDATE JOB
  // =====================================

  const handleJobSubmit = async (e) => {
    e.preventDefault();

    try {
      setSavingJob(true);
      setJobFeedback("");

      const jobData = {
        ...jobForm,
        skills: jobForm.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const isEditing = Boolean(editingJobId);

      const url = isEditing
        ? `${JOBS_API_URL}/${editingJobId}`
        : JOBS_API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: getAdminHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(jobData),
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save job.");
      }

      setJobFeedback(
        isEditing
          ? "Job updated successfully!"
          : "Job posted successfully!"
      );

      closeJobForm();
      await fetchJobs();
    } catch (err) {
      console.error("Save Job Error:", err);
      setJobFeedback(err.message || "Failed to save job.");
    } finally {
      setSavingJob(false);
    }
  };

  // =====================================
  // DELETE JOB
  // =====================================

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job opening?"
    );

    if (!confirmed) return;

    try {
      setJobFeedback("");

      const response = await fetch(`${JOBS_API_URL}/${jobId}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete job.");
      }

      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      setJobFeedback("Job deleted successfully!");
    } catch (err) {
      console.error("Delete Job Error:", err);
      setJobFeedback(err.message || "Failed to delete job.");
    }
  };

  // =====================================
  // ADMIN LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin-login", { replace: true });
  };

  // =====================================
  // DASHBOARD STATISTICS
  // =====================================

  const totalApplications = applications.length;

  const selectedApplications = applications.filter(
    (app) => app.status === "Selected"
  ).length;

  const underReviewApplications = applications.filter(
    (app) => app.status === "Under Review"
  ).length;

  // =====================================
  // APPLICATION SEARCH AND FILTER
  // =====================================

  const filteredApplications = applications.filter((app) => {
    const search = searchTerm.trim().toLowerCase();

    const studentName = app.fullName || app.studentId?.name || "";
    const studentEmail = app.email || app.studentId?.email || "";
    const college = app.college || app.studentId?.college || "";

    const matchesSearch = [
      app.company,
      app.jobTitle,
      studentName,
      studentEmail,
      college,
    ].some((value) =>
      String(value || "").toLowerCase().includes(search)
    );

    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  // Resume URL
  const getResumeUrl = (application) => {
    const resumePath = application?.resume?.path;

    if (!resumePath) return "";

    return `${SERVER_URL}${resumePath.startsWith("/") ? "" : "/"}${resumePath}`;
  };

  // =====================================
  // DASHBOARD UI
  // =====================================

  return (
    <div className="admin-dashboard">

      {/* Dashboard Header */}
      <div className="admin-header">
        <div className="admin-heading">
          <h1>Admin Dashboard</h1>
          <p>
            Manage student placement applications and job openings.
          </p>
        </div>

        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          <span>↪</span> Logout
        </button>
      </div>

      {/* Dashboard Statistics */}
      <div className="admin-stats">
        <div className="admin-card">
          <h3>Total Applications</h3>
          <p>{totalApplications}</p>
        </div>

        <div className="admin-card">
          <h3>Selected</h3>
          <p>{selectedApplications}</p>
        </div>

        <div className="admin-card">
          <h3>Under Review</h3>
          <p>{underReviewApplications}</p>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab-btn ${
            activeTab === "applications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${
            activeTab === "jobs" ? "active" : ""
          }`}
          onClick={() => setActiveTab("jobs")}
        >
          Manage Jobs
        </button>
      </div>

      {/* =====================================
          APPLICATIONS SECTION
      ===================================== */}

      {activeTab === "applications" && (
        <>
          {loading && <p>Loading applications...</p>}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && (
            <div className="admin-applications">
              <h2>Applications</h2>

              {/* Search and Filter */}
              <div className="application-filters">
                <input
                  type="text"
                  placeholder="Search by student, email, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>

                  {ALLOWED_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>

              <p className="results-count">
                Showing {filteredApplications.length} of{" "}
                {totalApplications} applications
              </p>

              {/* Applications List */}
              {filteredApplications.length === 0 ? (
                <p className="no-results">
                  No matching applications found.
                </p>
              ) : (
                filteredApplications.map((app) => (
                  <div
                    key={app._id}
                    className="admin-application-card"
                  >
                    <h3>{app.company}</h3>

                    <p>
                      <strong>Job Title:</strong> {app.jobTitle}
                    </p>

                    <p>
                      <strong>Student:</strong>{" "}
                      {app.fullName || app.studentId?.name || "N/A"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {app.email || app.studentId?.email || "N/A"}
                    </p>

                    <p>
                      <strong>College:</strong>{" "}
                      {app.college || app.studentId?.college || "N/A"}
                    </p>

                    <p>
                      <strong>Current Status:</strong> {app.status}
                    </p>

                    <button
                      type="button"
                      className="view-details-btn"
                      onClick={() => setSelectedApplication(app)}
                    >
                      View Details
                    </button>

                    <div className="status-update-section">
                      <label>Update Application Status:</label>

                      <select
                        value={statusChanges[app._id] ?? app.status}
                        onChange={(e) =>
                          handleStatusChange(app._id, e.target.value)
                        }
                        disabled={updatingId === app._id}
                      >
                        {ALLOWED_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(app._id, app.status)
                        }
                        disabled={updatingId === app._id}
                      >
                        {updatingId === app._id
                          ? "Updating..."
                          : "Update Status"}
                      </button>

                      {feedback[app._id] && (
                        <p
                          className={
                            feedback[app._id].includes("successfully")
                              ? "success-message"
                              : "error-message"
                          }
                          role="status"
                        >
                          {feedback[app._id]}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* =====================================
          MANAGE JOBS SECTION
      ===================================== */}

      {activeTab === "jobs" && (
        <div className="manage-jobs-section">

          <div className="manage-jobs-header">
            <h2>Manage Job Openings</h2>

            {!showJobForm && (
              <button
                type="button"
                className="add-job-btn"
                onClick={openAddJobForm}
              >
                + Add New Job
              </button>
            )}
          </div>

          {jobFeedback && (
            <p
              className={`job-feedback ${
                jobFeedback.toLowerCase().includes("successfully")
                  ? "job-success"
                  : "job-error"
              }`}
              role="status"
            >
              {jobFeedback}
            </p>
          )}

          {/* Add / Edit Job Form */}
          {showJobForm && (
            <form className="job-form" onSubmit={handleJobSubmit}>
              <div className="job-form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={jobForm.companyName}
                  onChange={handleJobInputChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="job-form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={jobForm.jobTitle}
                  onChange={handleJobInputChange}
                  placeholder="Enter job title"
                  required
                />
              </div>

              <div className="job-form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={jobForm.location}
                  onChange={handleJobInputChange}
                  placeholder="e.g. Kanpur / Remote"
                  required
                />
              </div>

              <div className="job-form-group">
                <label>Salary *</label>
                <input
                  type="text"
                  name="salary"
                  value={jobForm.salary}
                  onChange={handleJobInputChange}
                  placeholder="e.g. 3.5 LPA"
                  required
                />
              </div>

              <div className="job-form-group">
                <label>Job Type *</label>
                <select
                  name="jobType"
                  value={jobForm.jobType}
                  onChange={handleJobInputChange}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="job-form-group">
                <label>Last Date to Apply *</label>
                <input
                  type="date"
                  name="lastDate"
                  value={jobForm.lastDate}
                  onChange={handleJobInputChange}
                  required
                />
              </div>

              <div className="job-form-group">
                <label>Required Skills *</label>
                <input
                  type="text"
                  name="skills"
                  value={jobForm.skills}
                  onChange={handleJobInputChange}
                  placeholder="React, JavaScript, HTML, CSS"
                  required
                />
              </div>

              <div className="job-form-group">
                <label>Eligibility *</label>
                <input
                  type="text"
                  name="eligibility"
                  value={jobForm.eligibility}
                  onChange={handleJobInputChange}
                  placeholder="e.g. MCA / BCA / B.Tech"
                  required
                />
              </div>

              <div className="job-form-group">
                <label>Job Status</label>
                <select
                  name="status"
                  value={jobForm.status}
                  onChange={handleJobInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="job-form-group full-width">
                <label>Job Description *</label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleJobInputChange}
                  placeholder="Enter job description and responsibilities..."
                  required
                />
              </div>

              <div className="job-form-actions">
                <button
                  type="submit"
                  className="job-submit-btn"
                  disabled={savingJob}
                >
                  {savingJob
                    ? "Saving..."
                    : editingJobId
                    ? "Update Job"
                    : "Post Job"}
                </button>

                <button
                  type="button"
                  className="job-cancel-btn"
                  onClick={closeJobForm}
                  disabled={savingJob}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Jobs List */}
          {jobsLoading ? (
            <p>Loading job openings...</p>
          ) : jobsError ? (
            <p className="error-message" role="alert">
              {jobsError}
            </p>
          ) : jobs.length === 0 ? (
            <p className="no-results">
              No job openings found. Click "Add New Job" to post one.
            </p>
          ) : (
            <>
              <p className="results-count">
                Total Job Openings: {jobs.length}
              </p>

              {jobs.map((job) => (
                <div key={job._id} className="admin-job-card">
                  <h3>{job.jobTitle}</h3>

                  <p>
                    <strong>Company:</strong> {job.companyName}
                  </p>

                  <p>
                    <strong>Location:</strong> {job.location}
                  </p>

                  <p>
                    <strong>Salary:</strong> {job.salary}
                  </p>

                  <p>
                    <strong>Job Type:</strong> {job.jobType}
                  </p>

                  <p>
                    <strong>Skills:</strong>{" "}
                    {Array.isArray(job.skills)
                      ? job.skills.join(", ")
                      : job.skills || "N/A"}
                  </p>

                  <p>
                    <strong>Eligibility:</strong>{" "}
                    {job.eligibility || "N/A"}
                  </p>

                  <p>
                    <strong>Last Date:</strong>{" "}
                    {formatDate(job.lastDate)}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {job.description || "N/A"}
                  </p>

                  <span
                    className={`job-status ${
                      job.status === "Closed" ? "closed" : ""
                    }`}
                  >
                    {job.status || "Active"}
                  </span>

                  <div className="job-card-actions">
                    <button
                      type="button"
                      className="job-edit-btn"
                      onClick={() => handleEditJob(job)}
                    >
                      Edit Job
                    </button>

                    <button
                      type="button"
                      className="job-delete-btn"
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      Delete Job
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* =====================================
          APPLICATION DETAILS POPUP
      ===================================== */}

      {selectedApplication && (
        <div
          className="application-modal-overlay"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="application-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="application-modal-header">
              <div>
                <h2 id="application-modal-title">
                  Application Details
                </h2>
                <p>Complete student application information</p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedApplication(null)}
                aria-label="Close details"
              >
                &times;
              </button>
            </div>

            {/* Personal Details */}
            <div className="detail-section">
              <h3>Personal Information</h3>

              <div className="detail-grid">
                <div>
                  <label>Full Name</label>
                  <p>{selectedApplication.fullName || "N/A"}</p>
                </div>

                <div>
                  <label>Email Address</label>
                  <p>{selectedApplication.email || "N/A"}</p>
                </div>

                <div>
                  <label>Phone Number</label>
                  <p>{selectedApplication.phone || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="detail-section">
              <h3>Job Information</h3>

              <div className="detail-grid">
                <div>
                  <label>Company</label>
                  <p>{selectedApplication.company || "N/A"}</p>
                </div>

                <div>
                  <label>Job Title</label>
                  <p>{selectedApplication.jobTitle || "N/A"}</p>
                </div>

                <div>
                  <label>Location</label>
                  <p>{selectedApplication.location || "N/A"}</p>
                </div>

                <div>
                  <label>Salary</label>
                  <p>{selectedApplication.salary || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Education Details */}
            <div className="detail-section">
              <h3>Education Information</h3>

              <div className="detail-grid">
                <div>
                  <label>Course</label>
                  <p>{selectedApplication.course || "N/A"}</p>
                </div>

                <div>
                  <label>College</label>
                  <p>{selectedApplication.college || "N/A"}</p>
                </div>

                <div>
                  <label>Graduation Year</label>
                  <p>{selectedApplication.graduationYear || "N/A"}</p>
                </div>

                <div>
                  <label>CGPA</label>
                  <p>{selectedApplication.cgpa ?? "N/A"}</p>
                </div>

                <div className="detail-full-width">
                  <label>Skills</label>
                  <p>{selectedApplication.skills || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="detail-section">
              <h3>Cover Letter</h3>
              <p className="cover-letter-text">
                {selectedApplication.coverLetter || "Not provided"}
              </p>
            </div>

            {/* Application Information */}
            <div className="detail-section">
              <h3>Application Information</h3>

              <div className="detail-grid">
                <div>
                  <label>Application Status</label>
                  <p className="detail-status">
                    {selectedApplication.status || "N/A"}
                  </p>
                </div>

                <div>
                  <label>Applied Date</label>
                  <p>{formatDate(selectedApplication.appliedAt)}</p>
                </div>

                <div>
                  <label>Interview Date</label>
                  <p>{formatDate(selectedApplication.interviewDate)}</p>
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className="detail-section">
              <h3>Student Resume</h3>

              {selectedApplication.resume?.path ? (
                <div className="resume-details">
                  <p>
                    {selectedApplication.resume.originalName ||
                      selectedApplication.resume.filename ||
                      "Uploaded Resume"}
                  </p>

                  <a
                    href={getResumeUrl(selectedApplication)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View / Download Resume
                  </a>
                </div>
              ) : (
                <p>Resume not available.</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
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

export default AdminDashboard;
