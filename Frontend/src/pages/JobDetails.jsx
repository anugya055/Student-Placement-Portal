
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./JobDetails.css";

function JobDetails() {

  const location = useLocation();
  const navigate = useNavigate();

  // Get selected job from Jobs.jsx
  const job = location.state?.job;


  // If no job is selected
  if (!job) {

    return (
      <div className="job-details-error">

        <div className="error-icon">
          📄
        </div>

        <h2>
          No Job Selected
        </h2>

        <p>
          Please select a job from the Job Opportunities page.
        </p>

        <button
          onClick={() => navigate("/jobs")}
        >
          ← Browse Jobs
        </button>

      </div>
    );

  }


  // =========================================
  // APPLY NOW
  // =========================================

  const handleApply = () => {

    navigate("/apply", {
      state: {
        job: job
      }
    });

  };


  // =========================================
  // BACK TO JOBS
  // =========================================

  const handleBack = () => {

    navigate("/jobs");

  };


  return (

    <div className="job-details-page">


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="job-details-sidebar">


        {/* Logo */}

        <div className="job-details-logo">
          🎓 <span>PlacementHub</span>
        </div>


        {/* Navigation */}

        <nav className="job-details-menu">

          <a
            href="/dashboard"
            className="job-details-menu-item"
          >
            <span>📊</span>
            Dashboard
          </a>


          <a
            href="/profile"
            className="job-details-menu-item"
          >
            <span>👤</span>
            My Profile
          </a>


          <a
            href="/jobs"
            className="job-details-menu-item active"
          >
            <span>💼</span>
            Job Opportunities
          </a>


          <a
            href="/applications"
            className="job-details-menu-item"
          >
            <span>📄</span>
            My Applications
          </a>


          <a
            href="/interviews"
            className="job-details-menu-item"
          >
            <span>📅</span>
            Interviews
          </a>


          <a
            href="/preparation"
            className="job-details-menu-item"
          >
            <span>🎯</span>
            Preparation
          </a>


          <a
            href="/notifications"
            className="job-details-menu-item"
          >
            <span>🔔</span>
            Notifications

            <span className="job-details-notification">
              3
            </span>

          </a>

        </nav>


        {/* Bottom */}

        <div className="job-details-sidebar-bottom">

          <a
            href="/settings"
            className="job-details-menu-item"
          >
            <span>⚙️</span>
            Settings
          </a>


          <a
            href="/login"
            className="job-details-menu-item job-details-logout"
          >
            <span>🚪</span>
            Logout
          </a>

        </div>

      </aside>



      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="job-details-main">


        {/* =====================================
            NAVBAR
        ===================================== */}

        <header className="job-details-navbar">

          <div>

            <h2>
              Job Details
            </h2>

            <p>
              Explore this opportunity before applying
            </p>

          </div>


          {/* User */}

          <div className="job-details-user">

            <div className="job-details-avatar">
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
            CONTENT
        ===================================== */}

        <div className="job-details-content">


          {/* Back */}

          <button
            className="back-to-jobs"
            onClick={handleBack}
          >
            ← Back to Job Opportunities
          </button>



          {/* =====================================
              JOB HEADER
          ===================================== */}

          <section className="job-details-header">


            <div className="job-details-company-logo">
              {job.logo}
            </div>


            <div className="job-details-title">

              <span className="job-details-label">
                JOB OPPORTUNITY
              </span>

              <h1>
                {job.role}
              </h1>

              <h2>
                {job.company}
              </h2>

              <div className="job-header-info">

                <span>
                  📍 {job.location}
                </span>

                <span>
                  💰 {job.salary}
                </span>

                <span>
                  👨‍💻 {job.experience}
                </span>

              </div>

            </div>


            {/* Apply Button */}

            <div className="job-apply-area">

              <span>
                Apply before
              </span>

              <strong>
                {job.deadline}
              </strong>

              <button
                className="job-apply-btn"
                onClick={handleApply}
              >
                Apply Now →
              </button>

            </div>

          </section>



          {/* =====================================
              MAIN DETAILS
          ===================================== */}

          <div className="job-details-grid">


            {/* =================================
                LEFT SIDE
            ================================= */}

            <div className="job-details-left">


              {/* About Job */}

              <section className="details-card">

                <h2>
                  About the Job
                </h2>

                <p>
                  We are looking for talented and motivated
                  candidates to join our team as a
                  <strong> {job.role}</strong>.
                  This is an excellent opportunity for fresh
                  graduates to start their professional career
                  and work on real-world projects.
                </p>

                <p>
                  The selected candidate will get the opportunity
                  to work with experienced professionals, learn
                  new technologies and contribute to meaningful
                  projects.
                </p>

              </section>



              {/* Responsibilities */}

              <section className="details-card">

                <h2>
                  Job Responsibilities
                </h2>

                <ul>

                  <li>
                    Develop and maintain high-quality software applications.
                  </li>

                  <li>
                    Work with team members to design and implement solutions.
                  </li>

                  <li>
                    Write clean, efficient and maintainable code.
                  </li>

                  <li>
                    Participate in testing and debugging activities.
                  </li>

                  <li>
                    Learn and apply new technologies as required.
                  </li>

                </ul>

              </section>



              {/* Requirements */}

              <section className="details-card">

                <h2>
                  Requirements
                </h2>

                <ul>

                  <li>
                    Candidates must have good programming fundamentals.
                  </li>

                  <li>
                    Good problem-solving and analytical skills.
                  </li>

                  <li>
                    Strong communication and teamwork skills.
                  </li>

                  <li>
                    Willingness to learn new technologies.
                  </li>

                  <li>
                    Must meet the required educational eligibility.
                  </li>

                </ul>

              </section>



              {/* Skills */}

              <section className="details-card">

                <h2>
                  Required Skills
                </h2>

                <div className="details-skills">

                  {job.skills &&
                    job.skills.map(
                      (skill, index) => (

                        <span key={index}>
                          {skill}
                        </span>

                      )
                    )}

                </div>

              </section>


            </div>



            {/* =================================
                RIGHT SIDE
            ================================= */}

            <div className="job-details-right">


              {/* Job Overview */}

              <section className="overview-card">

                <h2>
                  Job Overview
                </h2>


                <div className="overview-item">

                  <span>
                    💼
                  </span>

                  <div>

                    <small>
                      Job Type
                    </small>

                    <strong>
                      Full Time
                    </strong>

                  </div>

                </div>


                <div className="overview-item">

                  <span>
                    📍
                  </span>

                  <div>

                    <small>
                      Location
                    </small>

                    <strong>
                      {job.location}
                    </strong>

                  </div>

                </div>


                <div className="overview-item">

                  <span>
                    💰
                  </span>

                  <div>

                    <small>
                      Salary
                    </small>

                    <strong>
                      {job.salary}
                    </strong>

                  </div>

                </div>


                <div className="overview-item">

                  <span>
                    🎓
                  </span>

                  <div>

                    <small>
                      Education
                    </small>

                    <strong>
                      {job.eligibility}
                    </strong>

                  </div>

                </div>


                <div className="overview-item">

                  <span>
                    👨‍💻
                  </span>

                  <div>

                    <small>
                      Experience
                    </small>

                    <strong>
                      {job.experience}
                    </strong>

                  </div>

                </div>


                <div className="overview-item">

                  <span>
                    ⏰
                  </span>

                  <div>

                    <small>
                      Application Deadline
                    </small>

                    <strong>
                      {job.deadline}
                    </strong>

                  </div>

                </div>

              </section>



              {/* Eligibility */}

              <section className="eligibility-card">

                <h2>
                  Eligibility
                </h2>

                <div className="eligibility-check">
                  ✓
                </div>

                <p>
                  This opportunity is suitable for
                  <strong> {job.eligibility}</strong>
                  candidates.
                </p>

              </section>



              {/* Apply Box */}

              <section className="apply-box">

                <div className="apply-box-icon">
                  🚀
                </div>

                <h2>
                  Ready to Apply?
                </h2>

                <p>
                  Submit your application before
                  the deadline.
                </p>

                <button
                  onClick={handleApply}
                >
                  Apply Now →
                </button>

              </section>


            </div>

          </div>


        </div>

      </main>

    </div>
  );
}

export default JobDetails;
