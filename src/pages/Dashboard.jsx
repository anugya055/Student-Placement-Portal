import React from "react";
import "./Dashboard.css";

function Dashboard() {

  return (
    <div className="dashboard">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="sidebar">

        {/* Logo */}

        <div className="dashboard-logo">
          🎓 <span>PlacementHub</span>
        </div>


        {/* Menu */}

        <div className="sidebar-menu">

          <a href="/dashboard" className="menu-item active">
            <span>📊</span>
            Dashboard
          </a>

          <a href="/profile" className="menu-item">
            <span>👤</span>
            My Profile
          </a>

          <a href="/jobs" className="menu-item">
            <span>💼</span>
            Job Opportunities
          </a>

          <a href="/applications" className="menu-item">
            <span>📄</span>
            My Applications
          </a>

          <a href="/interviews" className="menu-item">
            <span>📅</span>
            Interviews
          </a>

          <a href="/preparation" className="menu-item">
            <span>🎯</span>
            Preparation
          </a>

          <a href="/notifications" className="menu-item">
            <span>🔔</span>
            Notifications
            <span className="notification-count">3</span>
          </a>

        </div>


        {/* Bottom Menu */}

        <div className="sidebar-bottom">

          <a href="/settings" className="menu-item">
            <span>⚙️</span>
            Settings
          </a>

          <a href="/login" className="menu-item logout">
            <span>🚪</span>
            Logout
          </a>

        </div>

      </aside>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="dashboard-main">

        {/* =====================================
            TOP NAVBAR
        ===================================== */}

        <header className="dashboard-navbar">

          <div>
            <h2>Student Dashboard</h2>
            <p>Manage your placement journey</p>
          </div>


          <div className="dashboard-user">

            <button className="notification-btn">
              🔔
              <span>3</span>
            </button>

            <div className="user-info">

              <div className="user-avatar">
                A
              </div>

              <div>
                <strong>Anugya</strong>
                <small>Student</small>
              </div>

            </div>

          </div>

        </header>


        {/* =====================================
            PAGE CONTENT
        ===================================== */}

        <div className="dashboard-content">


          {/* Welcome */}

          <section className="welcome-section">

            <div>

              <span className="welcome-label">
                Welcome back 👋
              </span>

              <h1>
                Hello, Anugya!
              </h1>

              <p>
                Here's an overview of your placement activities.
              </p>

            </div>


            <a href="/jobs" className="find-job-btn">
              Find Jobs →
            </a>

          </section>


          {/* =====================================
              STAT CARDS
          ===================================== */}

          <section className="dashboard-stats">


            <div className="dashboard-stat-card">

              <div className="stat-icon blue">
                📄
              </div>

              <div className="stat-details">

                <span>
                  Applications
                </span>

                <h2>
                  12
                </h2>

                <p>
                  <strong>+3</strong> this month
                </p>

              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-icon teal">
                📅
              </div>

              <div className="stat-details">

                <span>
                  Interviews
                </span>

                <h2>
                  4
                </h2>

                <p>
                  <strong>2</strong> upcoming
                </p>

              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-icon green">
                🎉
              </div>

              <div className="stat-details">

                <span>
                  Offers
                </span>

                <h2>
                  2
                </h2>

                <p>
                  Keep going!
                </p>

              </div>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-icon purple">
                🎯
              </div>

              <div className="stat-details">

                <span>
                  Profile Score
                </span>

                <h2>
                  85%
                </h2>

                <p>
                  <strong>Good</strong> profile
                </p>

              </div>

            </div>

          </section>


          {/* =====================================
              MAIN GRID
          ===================================== */}

          <section className="dashboard-grid">


            {/* =================================
                RECENT APPLICATIONS
            ================================= */}

            <div className="applications-card">

              <div className="card-title">

                <div>
                  <h2>
                    Recent Applications
                  </h2>

                  <p>
                    Track your latest job applications
                  </p>
                </div>

                <a href="/applications">
                  View All →
                </a>

              </div>


              <div className="application-list">


                {/* Application 1 */}

                <div className="application-row">

                  <div className="company-logo">
                    T
                  </div>

                  <div className="application-info">

                    <h3>
                      Software Engineer
                    </h3>

                    <p>
                      TCS • Full Time
                    </p>

                  </div>

                  <span className="status applied">
                    Applied
                  </span>

                </div>


                {/* Application 2 */}

                <div className="application-row">

                  <div className="company-logo">
                    I
                  </div>

                  <div className="application-info">

                    <h3>
                      Java Developer
                    </h3>

                    <p>
                      Infosys • Full Time
                    </p>

                  </div>

                  <span className="status interview">
                    Interview
                  </span>

                </div>


                {/* Application 3 */}

                <div className="application-row">

                  <div className="company-logo">
                    W
                  </div>

                  <div className="application-info">

                    <h3>
                      React Developer
                    </h3>

                    <p>
                      Wipro • Full Time
                    </p>

                  </div>

                  <span className="status review">
                    Under Review
                  </span>

                </div>


                {/* Application 4 */}

                <div className="application-row">

                  <div className="company-logo">
                    A
                  </div>

                  <div className="application-info">

                    <h3>
                      Frontend Developer
                    </h3>

                    <p>
                      Accenture • Full Time
                    </p>

                  </div>

                  <span className="status rejected">
                    Rejected
                  </span>

                </div>

              </div>

            </div>


            {/* =================================
                UPCOMING INTERVIEWS
            ================================= */}

            <div className="interviews-card">

              <div className="card-title">

                <div>
                  <h2>
                    Upcoming Interviews
                  </h2>

                  <p>
                    Your scheduled interviews
                  </p>
                </div>

                <a href="/interviews">
                  View All
                </a>

              </div>


              <div className="interview-list">


                <div className="interview-item">

                  <div className="interview-date">
                    <strong>28</strong>
                    <span>Aug</span>
                  </div>

                  <div className="interview-info">

                    <h3>
                      Java Developer
                    </h3>

                    <p>
                      Infosys
                    </p>

                    <span>
                      🕐 10:30 AM
                    </span>

                  </div>

                </div>


                <div className="interview-item">

                  <div className="interview-date">
                    <strong>02</strong>
                    <span>Sep</span>
                  </div>

                  <div className="interview-info">

                    <h3>
                      Software Engineer
                    </h3>

                    <p>
                      TCS
                    </p>

                    <span>
                      🕐 02:00 PM
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* =====================================
              PROFILE PROGRESS
          ===================================== */}

          <section className="bottom-grid">


            {/* Profile */}

            <div className="profile-progress-card">

              <div className="card-title">

                <div>

                  <h2>
                    Complete Your Profile
                  </h2>

                  <p>
                    A complete profile improves your chances.
                  </p>

                </div>

                <strong>
                  85%
                </strong>

              </div>


              <div className="profile-progress">

                <div className="profile-progress-bar">
                  <div></div>
                </div>

              </div>


              <div className="profile-tasks">

                <span className="completed">
                  ✓ Basic Information
                </span>

                <span className="completed">
                  ✓ Education
                </span>

                <span className="completed">
                  ✓ Skills
                </span>

                <span>
                  ○ Add Resume
                </span>

              </div>


              <a
                href="/profile"
                className="complete-profile-btn"
              >
                Complete Profile →
              </a>

            </div>


            {/* Quick Actions */}

            <div className="quick-actions-card">

              <div className="card-title">

                <div>

                  <h2>
                    Quick Actions
                  </h2>

                  <p>
                    Frequently used options
                  </p>

                </div>

              </div>


              <div className="quick-actions">

                <a href="/jobs">
                  <span>💼</span>
                  <div>
                    <strong>Browse Jobs</strong>
                    <small>Find new opportunities</small>
                  </div>
                </a>


                <a href="/profile">
                  <span>👤</span>
                  <div>
                    <strong>Update Profile</strong>
                    <small>Keep your profile updated</small>
                  </div>
                </a>


                <a href="/preparation">
                  <span>🎯</span>
                  <div>
                    <strong>Practice</strong>
                    <small>Prepare for interviews</small>
                  </div>
                </a>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;