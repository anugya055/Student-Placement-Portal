
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";

function Jobs() {

  const navigate = useNavigate();

  // =========================================
  // JOB DATA
  // =========================================

  const jobs = [
    {
      id: 1,
      company: "TCS",
      role: "Software Engineer",
      location: "Pune, India",
      salary: "6 - 8 LPA",
      experience: "Fresher",
      deadline: "15 Sep 2026",
      eligibility: "MCA / B.Tech",
      skills: ["Java", "React.js", "SQL"],
      logo: "T",
    },

    {
      id: 2,
      company: "Infosys",
      role: "Java Developer",
      location: "Bangalore, India",
      salary: "5 - 7 LPA",
      experience: "Fresher",
      deadline: "18 Sep 2026",
      eligibility: "MCA / B.Tech",
      skills: ["Java", "Spring Boot", "SQL"],
      logo: "I",
    },

    {
      id: 3,
      company: "Wipro",
      role: "React Developer",
      location: "Hyderabad, India",
      salary: "5 - 8 LPA",
      experience: "Fresher",
      deadline: "20 Sep 2026",
      eligibility: "MCA / B.Tech",
      skills: ["React.js", "JavaScript", "CSS"],
      logo: "W",
    },

    {
      id: 4,
      company: "Accenture",
      role: "Frontend Developer",
      location: "Noida, India",
      salary: "6 - 9 LPA",
      experience: "Fresher",
      deadline: "22 Sep 2026",
      eligibility: "MCA / B.Tech",
      skills: ["HTML", "CSS", "JavaScript"],
      logo: "A",
    },

    {
      id: 5,
      company: "Cognizant",
      role: "Full Stack Developer",
      location: "Chennai, India",
      salary: "6 - 9 LPA",
      experience: "Fresher",
      deadline: "25 Sep 2026",
      eligibility: "MCA / B.Tech",
      skills: ["React.js", "Node.js", "MongoDB"],
      logo: "C",
    },

    {
      id: 6,
      company: "Capgemini",
      role: "Software Developer",
      location: "Mumbai, India",
      salary: "5 - 7 LPA",
      experience: "Fresher",
      deadline: "28 Sep 2026",
      eligibility: "MCA / B.Tech",
      skills: ["Java", "Python", "SQL"],
      logo: "C",
    },
  ];


  // =========================================
  // STATES
  // =========================================

  const [search, setSearch] = useState("");

  const [location, setLocation] =
    useState("All Locations");

  const [role, setRole] =
    useState("All Roles");


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
      job.location.includes(location);

    const roleMatch =
      role === "All Roles" ||
      job.role === role;

    return (
      searchMatch &&
      locationMatch &&
      roleMatch
    );
  });


  // =========================================
  // VIEW JOB DETAILS
  // =========================================

  const viewJobDetails = (job) => {

    navigate("/job-details", {
      state: {
        job: job
      }
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


  return (

    <div className="jobs-page">


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="jobs-sidebar">


        {/* Logo */}

        <div className="jobs-logo">
          🎓 <span>PlacementHub</span>
        </div>


        {/* Navigation */}

        <nav className="jobs-menu">

          <a
            href="/dashboard"
            className="jobs-menu-item"
          >
            <span>📊</span>
            Dashboard
          </a>


          <a
            href="/profile"
            className="jobs-menu-item"
          >
            <span>👤</span>
            My Profile
          </a>


          <a
            href="/jobs"
            className="jobs-menu-item active"
          >
            <span>💼</span>
            Job Opportunities
          </a>


          <a
            href="/applications"
            className="jobs-menu-item"
          >
            <span>📄</span>
            My Applications
          </a>


          <a
            href="/interviews"
            className="jobs-menu-item"
          >
            <span>📅</span>
            Interviews
          </a>


          <a
            href="/preparation"
            className="jobs-menu-item"
          >
            <span>🎯</span>
            Preparation
          </a>


          <a
            href="/notifications"
            className="jobs-menu-item"
          >
            <span>🔔</span>
            Notifications

            <span className="jobs-notification">
              3
            </span>

          </a>

        </nav>


        {/* Bottom Menu */}

        <div className="jobs-sidebar-bottom">

          <a
            href="/settings"
            className="jobs-menu-item"
          >
            <span>⚙️</span>
            Settings
          </a>


          <a
            href="/login"
            className="jobs-menu-item jobs-logout"
          >
            <span>🚪</span>
            Logout
          </a>

        </div>

      </aside>



      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="jobs-main">


        {/* =====================================
            NAVBAR
        ===================================== */}

        <header className="jobs-navbar">

          <div>

            <h2>
              Job Opportunities
            </h2>

            <p>
              Find the right opportunity for your career
            </p>

          </div>


          {/* User */}

          <div className="jobs-user">

            <div className="jobs-avatar">
              A
            </div>

            <div>

              <strong>
                Anugya
              </strong>

              <small>
                Student
              </small>

            </div>

          </div>

        </header>



        {/* =====================================
            PAGE CONTENT
        ===================================== */}

        <div className="jobs-content">


          {/* =====================================
              PAGE HEADER
          ===================================== */}

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


            {/* Job Count */}

            <div className="jobs-count">

              <strong>
                {filteredJobs.length}
              </strong>

              <span>
                Jobs Available
              </span>

            </div>

          </section>



          {/* =====================================
              SEARCH & FILTER
          ===================================== */}

          <section className="jobs-filter-card">


            {/* Search */}

            <div className="job-search">

              <span>
                🔍
              </span>

              <input
                type="text"
                placeholder="Search by company, role or skill..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            {/* Location */}

            <select
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            >

              <option>
                All Locations
              </option>

              <option value="Pune">
                Pune
              </option>

              <option value="Bangalore">
                Bangalore
              </option>

              <option value="Hyderabad">
                Hyderabad
              </option>

              <option value="Noida">
                Noida
              </option>

              <option value="Chennai">
                Chennai
              </option>

              <option value="Mumbai">
                Mumbai
              </option>

            </select>


            {/* Role */}

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >

              <option>
                All Roles
              </option>

              <option>
                Software Engineer
              </option>

              <option>
                Java Developer
              </option>

              <option>
                React Developer
              </option>

              <option>
                Frontend Developer
              </option>

              <option>
                Full Stack Developer
              </option>

              <option>
                Software Developer
              </option>

            </select>


            {/* Clear Filters */}

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



          {/* =====================================
              JOB LIST
          ===================================== */}

          <section className="jobs-list">


            {filteredJobs.length > 0 ? (

              filteredJobs.map((job) => (

                <article
                  className="job-card"
                  key={job.id}
                >


                  {/* Company Logo */}

                  <div className="company-logo">
                    {job.logo}
                  </div>


                  {/* Job Details */}

                  <div className="job-details">


                    {/* Title */}

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
                        Full Time
                      </span>

                    </div>



                    {/* Job Information */}

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



                    {/* Skills */}

                    <div className="job-skills">

                      {job.skills.map(
                        (skill, index) => (

                          <span
                            key={index}
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>



                    {/* Bottom */}

                    <div className="job-bottom">


                      <span className="deadline">
                        ⏰ Apply before {job.deadline}
                      </span>


                      {/* VIEW DETAILS BUTTON */}

                      <button
                        className="apply-btn"
                        onClick={() =>
                          viewJobDetails(job)
                        }
                      >
                        View Details →
                      </button>

                    </div>

                  </div>

                </article>

              ))

            ) : (


              /* =================================
                 NO JOBS
              ================================= */

              <div className="no-jobs">

                <div>
                  🔍
                </div>

                <h2>
                  No Jobs Found
                </h2>

                <p>
                  Try changing your search
                  or filters.
                </p>

                <button
                  onClick={clearFilters}
                >
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

