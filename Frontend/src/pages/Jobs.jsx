
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";

const API_URL = "http://localhost:5000/api/jobs";

// Format date for display
const formatDate = (dateValue) => {
  if (!dateValue) return "Not specified";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Jobs() {
  const navigate = useNavigate();

  // =========================================
  // STATES
  // =========================================

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [location, setLocation] = useState("All Locations");

  const [role, setRole] = useState("All Roles");

  // =========================================
  // FETCH JOBS FROM BACKEND
  // =========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch jobs from server.");
      }

      const data = await response.json();

      // Support both array and { jobs: [] } responses
      const jobList = Array.isArray(data)
        ? data
        : Array.isArray(data.jobs)
          ? data.jobs
          : [];

      // Convert backend fields into the format
      // already used by this Jobs page.
      const formattedJobs = jobList.map((job) => ({
        ...job,

        id: job._id || job.id,

        company: job.companyName || job.company || "Company",

        role: job.jobTitle || job.role || "Job Opening",

        location: job.location || "Not specified",

        salary: job.salary || "Not disclosed",

        experience: job.experience || "Not specified",

        deadline: formatDate(job.lastDate || job.deadline),

        eligibility: job.eligibility || "Not specified",

        skills: Array.isArray(job.skills) ? job.skills : [],

        logo: (
          job.companyName ||
          job.company ||
          "C"
        ).charAt(0).toUpperCase(),

        jobType: job.jobType || "Full-time",
      }));

      setJobs(formattedJobs);
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when page loads
  useEffect(() => {
    fetchJobs();
  }, []);

  // =========================================
  // DYNAMIC FILTER OPTIONS
  // =========================================

  const locations = [
    ...new Set(
      jobs
        .map((job) => job.location)
        .filter((value) => value && value !== "Not specified")
    ),
  ];

  const roles = [
    ...new Set(
      jobs
        .map((job) => job.role)
        .filter(Boolean)
    ),
  ];

  // =========================================
  // FILTER JOBS
  // =========================================

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    const searchMatch =
      job.company.toLowerCase().includes(searchText) ||
      job.role.toLowerCase().includes(searchText) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchText)
      );

    const locationMatch =
      location === "All Locations" ||
      job.location === location;

    const roleMatch =
      role === "All Roles" ||
      job.role === role;

    return searchMatch && locationMatch && roleMatch;
  });

  // =========================================
  // VIEW JOB DETAILS
  // =========================================

  const viewJobDetails = (job) => {
    navigate("/job-details", {
      state: {
        job: job,
      },
    });
  };

  // =========================================
  // CLEAR FILTERS
  // =========================================

  const clearFilters = () => {
    setSearch("");
    setLocation("All Locations");
    setRole("All Roles");
  };

  // =========================================
  // JSX
  // =========================================

  return (
    <div className="jobs-page">

      {/* SIDEBAR */}

      <aside className="jobs-sidebar">

        <div className="jobs-logo">
          🎓 <span>PlacementHub</span>
        </div>

        <nav className="jobs-menu">

          <a href="/dashboard" className="jobs-menu-item">
            <span>📊</span>
            Dashboard
          </a>

          <a href="/profile" className="jobs-menu-item">
            <span>👤</span>
            My Profile
          </a>

          <a href="/jobs" className="jobs-menu-item active">
            <span>💼</span>
            Job Opportunities
          </a>

          <a href="/applications" className="jobs-menu-item">
            <span>📄</span>
            My Applications
          </a>

          <a href="/interviews" className="jobs-menu-item">
            <span>📅</span>
            Interviews
          </a>

          <a href="/preparation" className="jobs-menu-item">
            <span>🎯</span>
            Preparation
          </a>

          <a href="/notifications" className="jobs-menu-item">
            <span>🔔</span>
            Notifications

            <span className="jobs-notification">
              3
            </span>
          </a>

        </nav>

        <div className="jobs-sidebar-bottom">

          <a href="/settings" className="jobs-menu-item">
            <span>⚙️</span>
            Settings
          </a>

          <a href="/login" className="jobs-menu-item jobs-logout">
            <span>🚪</span>
            Logout
          </a>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="jobs-main">

        {/* NAVBAR */}

        <header className="jobs-navbar">

          <div>
            <h2>Job Opportunities</h2>

            <p>
              Find the right opportunity for your career
            </p>
          </div>

          <div className="jobs-user">

            <div className="jobs-avatar">
              A
            </div>

            <div>
              <strong>Anugya</strong>
              <small>Student</small>
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <div className="jobs-content">

          {/* PAGE HEADER */}

          <section className="jobs-heading">

            <div>

              <span className="jobs-label">
                CAREER OPPORTUNITIES
              </span>

              <h1>
                Find Your Dream Job 🚀
              </h1>

              <p>
                Explore placement opportunities
                from top companies.
              </p>

            </div>

            <div className="jobs-count">

              <strong>
                {filteredJobs.length}
              </strong>

              <span>
                Jobs Available
              </span>

            </div>

          </section>

          {/* SEARCH AND FILTER */}

          <section className="jobs-filter-card">

            <div className="job-search">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search by company, role or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            {/* Dynamic Location Filter */}

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >

              <option value="All Locations">
                All Locations
              </option>

              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}

            </select>

            {/* Dynamic Role Filter */}

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >

              <option value="All Roles">
                All Roles
              </option>

              {roles.map((jobRole) => (
                <option key={jobRole} value={jobRole}>
                  {jobRole}
                </option>
              ))}

            </select>

            {(search ||
              location !== "All Locations" ||
              role !== "All Roles") && (

              <button
                className="clear-filter"
                onClick={clearFilters}
              >
                Clear
              </button>

            )}

          </section>

          {/* JOB LIST */}

          <section className="jobs-list">

            {/* LOADING */}

            {loading && (
              <div className="no-jobs">
                <h2>Loading Jobs...</h2>
                <p>Please wait while we fetch available jobs.</p>
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="no-jobs">

                <h2>Unable to Load Jobs</h2>

                <p>{error}</p>

                <button onClick={fetchJobs}>
                  Try Again
                </button>

              </div>
            )}

            {/* JOB CARDS */}

            {!loading && !error && filteredJobs.length > 0 && (

              filteredJobs.map((job) => (

                <article
                  className="job-card"
                  key={job.id}
                >

                  {/* COMPANY LOGO */}

                  <div className="company-logo">
                    {job.logo}
                  </div>

                  {/* JOB DETAILS */}

                  <div className="job-details">

                    <div className="job-title-row">

                      <div>

                        <h2>
                          {job.role}
                        </h2>

                        <p className="company-name">
                          {job.company}
                        </p>

                      </div>

                      <span className="job-type">
                        {job.jobType}
                      </span>

                    </div>

                    {/* JOB INFORMATION */}

                    <div className="job-info">

                      <span>
                        📍 {job.location}
                      </span>

                      <span>
                        💰 {job.salary}
                      </span>

                      <span>
                        🎓 {job.eligibility}
                      </span>

                      <span>
                        👨‍💻 {job.experience}
                      </span>

                    </div>

                    {/* SKILLS */}

                    <div className="job-skills">

                      {job.skills.map((skill, index) => (

                        <span key={index}>
                          {skill}
                        </span>

                      ))}

                    </div>

                    {/* BOTTOM */}

                    <div className="job-bottom">

                      <span className="deadline">
                        ⏰ Apply before {job.deadline}
                      </span>

                      <button
                        className="apply-btn"
                        onClick={() => viewJobDetails(job)}
                      >
                        View Details →
                      </button>

                    </div>

                  </div>

                </article>

              ))

            )}

            {/* NO JOBS */}

            {!loading && !error && filteredJobs.length === 0 && (

              <div className="no-jobs">

                <div>🔍</div>

                <h2>
                  No Jobs Found
                </h2>

                <p>
                  Try changing your search or filters.
                </p>

                <button onClick={clearFilters}>
                  Reset Filters
                </button>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default Jobs;
