import React, { useState } from "react";
import "./Profile.css";

function Profile() {

  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "Anugya",
    lastName: "Trivedi",
    email: "anugya@example.com",
    phone: "9876543210",
    location: "Kanpur, Uttar Pradesh",
    course: "MCA",
    college: "Pranveer Singh Institute of Technology",
    graduationYear: "2027",
    cgpa: "9.17",
    github: "github.com/anugya",
    linkedin: "linkedin.com/in/anugya",
    bio: "MCA student passionate about software development and building real-world applications.",
  });

  const [skills, setSkills] = useState([
    "Java",
    "JavaScript",
    "React.js",
    "Node.js",
    "MongoDB",
    "HTML",
    "CSS",
  ]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-page">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="profile-sidebar">

        <div className="profile-logo">
          🎓 <span>PlacementHub</span>
        </div>

        <nav className="profile-menu">

          <a href="/dashboard" className="profile-menu-item">
            <span>📊</span>
            Dashboard
          </a>

          <a
            href="/profile"
            className="profile-menu-item active"
          >
            <span>👤</span>
            My Profile
          </a>

          <a href="/jobs" className="profile-menu-item">
            <span>💼</span>
            Job Opportunities
          </a>

          <a href="/applications" className="profile-menu-item">
            <span>📄</span>
            My Applications
          </a>

          <a href="/interviews" className="profile-menu-item">
            <span>📅</span>
            Interviews
          </a>

          <a href="/preparation" className="profile-menu-item">
            <span>🎯</span>
            Preparation
          </a>

          <a href="/notifications" className="profile-menu-item">
            <span>🔔</span>
            Notifications
            <span className="profile-notification">3</span>
          </a>

        </nav>


        <div className="profile-sidebar-bottom">

          <a href="/settings" className="profile-menu-item">
            <span>⚙️</span>
            Settings
          </a>

          <a href="/login" className="profile-menu-item profile-logout">
            <span>🚪</span>
            Logout
          </a>

        </div>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="profile-main">

        {/* Navbar */}

        <header className="profile-navbar">

          <div>
            <h2>My Profile</h2>
            <p>Manage your personal and academic information</p>
          </div>

          <div className="profile-navbar-user">

            <div className="profile-avatar">
              A
            </div>

            <div>
              <strong>Anugya</strong>
              <small>Student</small>
            </div>

          </div>

        </header>


        {/* Content */}

        <div className="profile-content">


          {/* =====================================
              PROFILE HEADER
          ===================================== */}

          <section className="profile-header-card">

            <div className="profile-large-avatar">
              A
            </div>

            <div className="profile-header-info">

              <h1>
                {profile.firstName} {profile.lastName}
              </h1>

              <p>
                {profile.course} Student
              </p>

              <span>
                📍 {profile.location}
              </span>

            </div>


            <div className="profile-header-action">

              {!editing ? (

                <button
                  className="edit-profile-btn"
                  onClick={() => setEditing(true)}
                >
                  ✏️ Edit Profile
                </button>

              ) : (

                <button
                  className="save-profile-btn"
                  onClick={handleSave}
                >
                  ✓ Save Changes
                </button>

              )}

            </div>

          </section>


          {/* =====================================
              PROFILE COMPLETION
          ===================================== */}

          <section className="completion-card">

            <div className="completion-info">

              <div>

                <h3>
                  Profile Completion
                </h3>

                <p>
                  Complete your profile to improve your placement opportunities.
                </p>

              </div>

              <strong>
                85%
              </strong>

            </div>

            <div className="completion-bar">

              <div></div>

            </div>

            <div className="completion-tasks">

              <span className="done">
                ✓ Personal Information
              </span>

              <span className="done">
                ✓ Education
              </span>

              <span className="done">
                ✓ Skills
              </span>

              <span className="done">
                ✓ Social Links
              </span>

              <span>
                ○ Upload Resume
              </span>

            </div>

          </section>


          {/* =====================================
              PERSONAL INFORMATION
          ===================================== */}

          <section className="profile-section">

            <div className="section-heading">

              <div>

                <h2>
                  Personal Information
                </h2>

                <p>
                  Your basic personal details
                </p>

              </div>

              <span>
                👤
              </span>

            </div>


            <div className="profile-form-grid">

              <div className="profile-field">

                <label>First Name</label>

                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>


              <div className="profile-field">

                <label>Last Name</label>

                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>


              <div className="profile-field">

                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>


              <div className="profile-field">

                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>


              <div className="profile-field">

                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

            </div>

          </section>


          {/* =====================================
              EDUCATION
          ===================================== */}

          <section className="profile-section">

            <div className="section-heading">

              <div>

                <h2>
                  Education
                </h2>

                <p>
                  Your academic qualifications
                </p>

              </div>

              <span>
                🎓
              </span>

            </div>


            <div className="education-card">

              <div className="education-icon">
                🎓
              </div>

              <div className="education-details">

                <h3>
                  {profile.course}
                </h3>

                <p>
                  {profile.college}
                </p>

                <span>
                  {profile.graduationYear} • CGPA: {profile.cgpa}
                </span>

              </div>

            </div>


            {editing && (

              <div className="profile-form-grid education-form">

                <div className="profile-field">

                  <label>Course</label>

                  <input
                    type="text"
                    name="course"
                    value={profile.course}
                    onChange={handleChange}
                  />

                </div>


                <div className="profile-field">

                  <label>Graduation Year</label>

                  <input
                    type="text"
                    name="graduationYear"
                    value={profile.graduationYear}
                    onChange={handleChange}
                  />

                </div>


                <div className="profile-field">

                  <label>College / University</label>

                  <input
                    type="text"
                    name="college"
                    value={profile.college}
                    onChange={handleChange}
                  />

                </div>


                <div className="profile-field">

                  <label>CGPA</label>

                  <input
                    type="text"
                    name="cgpa"
                    value={profile.cgpa}
                    onChange={handleChange}
                  />

                </div>

              </div>

            )}

          </section>


          {/* =====================================
              SKILLS
          ===================================== */}

          <section className="profile-section">

            <div className="section-heading">

              <div>

                <h2>
                  Skills
                </h2>

                <p>
                  Technical skills and expertise
                </p>

              </div>

              <span>
                💻
              </span>

            </div>


            <div className="skills-container">

              {skills.map((skill, index) => (

                <span
                  className="skill-tag"
                  key={index}
                >
                  {skill}
                </span>

              ))}

            </div>


            {editing && (

              <button
                className="add-skill-btn"
                onClick={() => {
                  const newSkill = prompt("Enter a skill:");

                  if (newSkill) {
                    setSkills([...skills, newSkill]);
                  }
                }}
              >
                + Add Skill
              </button>

            )}

          </section>


          {/* =====================================
              ABOUT ME
          ===================================== */}

          <section className="profile-section">

            <div className="section-heading">

              <div>

                <h2>
                  About Me
                </h2>

                <p>
                  Tell recruiters about yourself
                </p>

              </div>

              <span>
                ✨
              </span>

            </div>


            <textarea
              className="bio-input"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!editing}
              rows="5"
            />

          </section>


          {/* =====================================
              SOCIAL LINKS
          ===================================== */}

          <section className="profile-section">

            <div className="section-heading">

              <div>

                <h2>
                  Professional Links
                </h2>

                <p>
                  Connect your professional profiles
                </p>

              </div>

              <span>
                🔗
              </span>

            </div>


            <div className="profile-form-grid">

              <div className="profile-field">

                <label>
                  GitHub
                </label>

                <input
                  type="text"
                  name="github"
                  value={profile.github}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>


              <div className="profile-field">

                <label>
                  LinkedIn
                </label>

                <input
                  type="text"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

            </div>

          </section>


          {/* =====================================
              RESUME
          ===================================== */}

          <section className="profile-section">

            <div className="section-heading">

              <div>

                <h2>
                  Resume
                </h2>

                <p>
                  Upload your latest resume
                </p>

              </div>

              <span>
                📄
              </span>

            </div>


            <div className="resume-upload">

              <div className="resume-icon">
                📄
              </div>

              <div>

                <h3>
                  Upload Resume
                </h3>

                <p>
                  PDF format • Maximum 5 MB
                </p>

              </div>

              <button>
                Choose File
              </button>

            </div>

          </section>


        </div>

      </main>

    </div>
  );
}

export default Profile;