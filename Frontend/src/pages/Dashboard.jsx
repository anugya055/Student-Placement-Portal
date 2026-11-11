
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "http://localhost:5000/api/auth";
const APPLICATIONS_API_URL = "http://localhost:5000/api/applications";

function Dashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");

  // Get logged-in student details from sessionStorage
  useEffect(() => {
    const savedStudent = sessionStorage.getItem("student");

    if (!savedStudent) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const studentData = JSON.parse(savedStudent);

      if (
        !studentData ||
        !studentData.email ||
        !(studentData.id || studentData._id)
      ) {
        sessionStorage.removeItem("student");
        navigate("/login", { replace: true });
        return;
      }

      setStudent(studentData);
    } catch (error) {
      sessionStorage.removeItem("student");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Fetch the student's latest profile from MongoDB
  useEffect(() => {
    if (!student) return;

    let cancelled = false;

    const fetchProfile = async () => {
      setProfileLoading(true);

      try {
        const studentId = student.id || student._id;

        const response = await fetch(
          `${API_URL}/profile/${studentId}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch student profile.");
        }

        const data = await response.json();

        if (!cancelled) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [student]);

  // Fetch real applications belonging to the logged-in student
  useEffect(() => {
    if (!student) return;

    let cancelled = false;

    const fetchApplications = async () => {
      setApplicationsLoading(true);
      setApplicationsError("");

      try {
        const studentId = student.id || student._id;

        const response = await fetch(
          `${APPLICATIONS_API_URL}/${studentId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch applications."
          );
        }

        if (!cancelled) {
          setApplications(
            Array.isArray(data.applications)
              ? data.applications
              : []
          );
        }
      } catch (error) {
        console.error("Applications fetch error:", error);

        if (!cancelled) {
          setApplicationsError(
            "Unable to load applications. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setApplicationsLoading(false);
        }
      }
    };

    fetchApplications();

    return () => {
      cancelled = true;
    };
  }, [student]);

  // Wait until logged-in student details are loaded
  if (!student) {
    return null;
  }

  // Prefer the latest database details
  const studentName =
    profile?.name || student.name || "Student";

  const studentEmail =
    profile?.email || student.email || "";

  const studentInitial =
    studentName.charAt(0).toUpperCase();

  // Calculate profile completion score
  const profileFields = profile
    ? [
        Boolean(profile.name?.trim()),
        Boolean(profile.email?.trim()),
        Boolean(profile.phone?.trim()),
        Boolean(profile.college?.trim()),
        Boolean(profile.course?.trim()),
        profile.graduationYear !== undefined &&
          profile.graduationYear !== null &&
          String(profile.graduationYear).trim() !== "",
        profile.cgpa !== undefined &&
          profile.cgpa !== null &&
          String(profile.cgpa).trim() !== "",
        Array.isArray(profile.skills)
          ? profile.skills.length > 0
          : Boolean(profile.skills),
        Boolean(profile.resume?.trim()),
        Boolean(profile.bio?.trim()),
      ]
    : [];

  const profileScore = profile
    ? Math.round(
        (profileFields.filter(Boolean).length / 10) * 100
      )
    : 0;

  const profileStatus =
    profileScore >= 80
      ? "Excellent"
      : profileScore >= 60
        ? "Good"
        : "Needs improvement";

  // Calculate dashboard statistics from actual applications
  const interviewApplications = applications.filter(
    (application) =>
      application.status?.toLowerCase() === "interview"
  );

  const offerApplications = applications.filter(
    (application) =>
      application.status?.toLowerCase() === "selected" ||
      application.status?.toLowerCase() === "offered" ||
      application.status?.toLowerCase() === "offer"
  );

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.appliedAt || b.createdAt || 0) -
        new Date(a.appliedAt || a.createdAt || 0)
    )
    .slice(0, 4);

  // Keep status names compatible with the existing CSS
  const getStatusClass = (status = "") => {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === "applied") return "applied";
    if (normalizedStatus === "interview") return "interview";

    if (
      normalizedStatus === "under review" ||
      normalizedStatus === "shortlisted"
    ) {
      return "review";
    }

    if (normalizedStatus === "rejected") return "rejected";

    if (
      normalizedStatus === "selected" ||
      normalizedStatus === "offered" ||
      normalizedStatus === "offer"
    ) {
      return "selected";
    }

    return "review";
  };

  // Logout functionality
  const handleLogout = () => {
    sessionStorage.removeItem("student");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="dashboard-logo">
          🎓 <span>PlacementHub</span>
        </div>

        <div className="sidebar-menu">
          <Link to="/dashboard" className="menu-item active">
            <span>📊</span>
            Dashboard
          </Link>

          <Link to="/profile" className="menu-item">
            <span>👤</span>
            My Profile
          </Link>

          <Link to="/jobs" className="menu-item">
            <span>💼</span>
            Job Opportunities
          </Link>

          <Link to="/applications" className="menu-item">
            <span>📄</span>
            My Applications
          </Link>

          <Link to="/interviews" className="menu-item">
            <span>📅</span>
            Interviews
          </Link>

          <Link to="/preparation" className="menu-item">
            <span>🎯</span>
            Preparation
          </Link>

          <Link to="/notifications" className="menu-item">
            <span>🔔</span>
            Notifications
            <span className="notification-count">3</span>
          </Link>
        </div>

        {/* BOTTOM MENU */}
        <div className="sidebar-bottom">
          <Link to="/settings" className="menu-item">
            <span>⚙️</span>
            Settings
          </Link>

          <button
            type="button"
            className="menu-item logout"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* TOP NAVBAR */}
        <header className="dashboard-navbar">
          <div>
            <h2>Student Dashboard</h2>
            <p>Manage your placement journey</p>
          </div>

          <div className="dashboard-user">
            <button
              type="button"
              className="notification-btn"
              aria-label="Notifications"
            >
              🔔
              <span>3</span>
            </button>

            <div className="user-info">
              <div className="user-avatar">
                {studentInitial}
              </div>

              <div>
                <strong>{studentName}</strong>
                <small>{studentEmail}</small>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="dashboard-content">
          {/* WELCOME SECTION */}
          <section className="welcome-section">
            <div>
              <span className="welcome-label">
                Welcome back 👋
              </span>

              <h1>Hello, {studentName}!</h1>

              <p>
                Here's an overview of your placement activities.
              </p>
            </div>

            <Link to="/jobs" className="find-job-btn">
              Find Jobs →
            </Link>
          </section>

          {/* STAT CARDS */}
          <section className="dashboard-stats">
            <div className="dashboard-stat-card">
              <div className="stat-icon blue">📄</div>
              <div className="stat-details">
                <span>Applications</span>
                <h2>
                  {applicationsLoading ? "..." : applications.length}
                </h2>
                <p>Total submitted</p>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-icon teal">📅</div>
              <div className="stat-details">
                <span>Interviews</span>
                <h2>
                  {applicationsLoading
                    ? "..."
                    : interviewApplications.length}
                </h2>
                <p>Interview status</p>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-icon green">🎉</div>
              <div className="stat-details">
                <span>Offers</span>
                <h2>
                  {applicationsLoading
                    ? "..."
                    : offerApplications.length}
                </h2>
                <p>Selected applications</p>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-icon purple">🎯</div>
              <div className="stat-details">
                <span>Profile Score</span>
                <h2>
                  {profileLoading ? "..." : `${profileScore}%`}
                </h2>
                <p>
                  <strong>
                    {profileLoading ? "Loading" : profileStatus}
                  </strong>{" "}
                  profile
                </p>
              </div>
            </div>
          </section>

          {/* MAIN GRID */}
          <section className="dashboard-grid">
            {/* RECENT APPLICATIONS */}
            <div className="applications-card">
              <div className="card-title">
                <div>
                  <h2>Recent Applications</h2>
                  <p>Track your latest job applications</p>
                </div>

                <Link to="/applications">View All →</Link>
              </div>

              <div className="application-list">
                {applicationsLoading ? (
                  <p>Loading applications...</p>
                ) : applicationsError ? (
                  <p>{applicationsError}</p>
                ) : recentApplications.length === 0 ? (
                  <p>No applications submitted yet.</p>
                ) : (
                  recentApplications.map((application) => (
                    <div
                      className="application-row"
                      key={application._id}
                    >
                      <div className="company-logo">
                        {(application.company || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="application-info">
                        <h3>{application.jobTitle}</h3>
                        <p>
                          {application.company}
                          {" • "}
                          {application.status || "Applied"}
                        </p>
                      </div>

                      <span
                        className={`status ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status || "Applied"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* UPCOMING INTERVIEWS */}
            <div className="interviews-card">
              <div className="card-title">
                <div>
                  <h2>Upcoming Interviews</h2>
                  <p>Your scheduled interviews</p>
                </div>

                <Link to="/interviews">View All</Link>
              </div>

              <div className="interview-list">
                {applicationsLoading ? (
                  <p>Loading interviews...</p>
                ) : interviewApplications.length === 0 ? (
                  <p>No interview-stage applications yet.</p>
                ) : (
                  interviewApplications.map((application) => {
                    const interviewDate = application.interviewDate
                      ? new Date(application.interviewDate)
                      : null;

                    return (
                      <div
                        className="interview-item"
                        key={application._id}
                      >
                        <div className="interview-date">
                          {interviewDate &&
                          !Number.isNaN(interviewDate.getTime()) ? (
                            <>
                              <strong>
                                {interviewDate.toLocaleDateString(
                                  "en-IN",
                                  { day: "2-digit" }
                                )}
                              </strong>
                              <span>
                                {interviewDate.toLocaleDateString(
                                  "en-IN",
                                  { month: "short" }
                                )}
                              </span>
                            </>
                          ) : (
                            <>
                              <strong>--</strong>
                              <span>TBD</span>
                            </>
                          )}
                        </div>

                        <div className="interview-info">
                          <h3>{application.jobTitle}</h3>
                          <p>{application.company}</p>
                          <span>
                            {interviewDate &&
                            !Number.isNaN(interviewDate.getTime())
                              ? interviewDate.toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "Date not scheduled"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* PROFILE PROGRESS */}
          <section className="bottom-grid">
            <div className="profile-progress-card">
              <div className="card-title">
                <div>
                  <h2>Complete Your Profile</h2>
                  <p>
                    A complete profile improves your chances.
                  </p>
                </div>

                <strong>
                  {profileLoading ? "..." : `${profileScore}%`}
                </strong>
              </div>

              <div className="profile-progress">
                <div className="profile-progress-bar">
                  <div
                    style={{
                      width: `${profileScore}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="profile-tasks">
                <span className={profile?.name ? "completed" : ""}>
                  {profile?.name ? "✓" : "○"} Basic Information
                </span>

                <span
                  className={
                    profile?.college && profile?.course
                      ? "completed"
                      : ""
                  }
                >
                  {profile?.college && profile?.course ? "✓" : "○"}{" "}
                  Education
                </span>

                <span
                  className={
                    profile?.skills?.length ? "completed" : ""
                  }
                >
                  {profile?.skills?.length ? "✓" : "○"} Skills
                </span>

                <span
                  className={profile?.resume ? "completed" : ""}
                >
                  {profile?.resume ? "✓" : "○"} Resume
                </span>
              </div>

              <Link
                to="/profile"
                className="complete-profile-btn"
              >
                Complete Profile →
              </Link>
            </div>

            {/* QUICK ACTIONS */}
            <div className="quick-actions-card">
              <div className="card-title">
                <div>
                  <h2>Quick Actions</h2>
                  <p>Frequently used options</p>
                </div>
              </div>

              <div className="quick-actions">
                <Link to="/jobs">
                  <span>💼</span>
                  <div>
                    <strong>Browse Jobs</strong>
                    <small>Find new opportunities</small>
                  </div>
                </Link>

                <Link to="/profile">
                  <span>👤</span>
                  <div>
                    <strong>Update Profile</strong>
                    <small>Keep your profile updated</small>
                  </div>
                </Link>

                <Link to="/preparation">
                  <span>🎯</span>
                  <div>
                    <strong>Practice</strong>
                    <small>Prepare for interviews</small>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
