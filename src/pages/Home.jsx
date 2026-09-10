import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">

        <div className="logo">
          <span>🎓</span> PlacementHub
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#companies">Companies</a>
          <Link to="/login" className="login-btn">
            Login
          </Link>
          <Link to="/register" className="register-btn">
            Get Started
          </Link>
        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}
      <section className="hero">

        <div className="hero-content">

          <span className="hero-badge">
            🚀 Your Career Starts Here
          </span>

          <h1>
            Build Your Career.
            <span> Find Your Future.</span>
          </h1>

          <p>
            A smart placement platform that connects students
            with exciting career opportunities and helps colleges
            manage the complete placement process.
          </p>

          <div className="hero-buttons">

            <Link to="/register" className="primary-btn">
              Get Started →
            </Link>

            <a href="#how-it-works" className="secondary-btn">
              Learn More
            </a>

          </div>

        </div>


        <div className="hero-card">

          <div className="card-header">
            <div>
              <span className="small-text">Placement Overview</span>
              <h3>Career Progress</h3>
            </div>

            <span className="growth">↗ 24%</span>
          </div>

          <div className="progress-item">
            <div>
              <span>Applications</span>
              <strong>24</strong>
            </div>

            <div className="progress-bar">
              <div className="progress-fill application"></div>
            </div>
          </div>

          <div className="progress-item">
            <div>
              <span>Interviews</span>
              <strong>8</strong>
            </div>

            <div className="progress-bar">
              <div className="progress-fill interview"></div>
            </div>
          </div>

          <div className="progress-item">
            <div>
              <span>Offers</span>
              <strong>3</strong>
            </div>

            <div className="progress-bar">
              <div className="progress-fill offer"></div>
            </div>
          </div>

        </div>

      </section>


      {/* ================= STATS ================= */}
      <section className="stats">

        <div className="stat">
          <h2>500+</h2>
          <p>Students</p>
        </div>

        <div className="stat">
          <h2>50+</h2>
          <p>Companies</p>
        </div>

        <div className="stat">
          <h2>100+</h2>
          <p>Job Opportunities</p>
        </div>

        <div className="stat">
          <h2>85%</h2>
          <p>Placement Rate</p>
        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section id="features" className="section">

        <div className="section-heading">

          <span className="section-label">
            FEATURES
          </span>

          <h2>
            Everything You Need
            <span> For Your Career</span>
          </h2>

          <p>
            Manage your placement journey from profile creation
            to getting your dream job.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Student Profile</h3>
            <p>
              Create and manage your professional profile,
              skills, education and resume.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Explore Jobs</h3>
            <p>
              Discover job opportunities from top companies
              based on your skills and eligibility.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Easy Applications</h3>
            <p>
              Apply to eligible job opportunities and
              manage all your applications.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Interview Tracking</h3>
            <p>
              Keep track of interview dates, rounds and
              important interview information.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Placement Dashboard</h3>
            <p>
              View your applications, interviews and
              placement progress in one dashboard.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Notifications</h3>
            <p>
              Stay updated about new opportunities,
              application status and interviews.
            </p>
          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="how-section">

        <div className="section-heading">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2>
            Start Your Placement
            <span> Journey</span>
          </h2>

        </div>


        <div className="steps">

          <div className="step">
            <div className="step-number">01</div>

            <h3>Create Profile</h3>

            <p>
              Register and create your professional
              student profile.
            </p>
          </div>


          <div className="step">
            <div className="step-number">02</div>

            <h3>Explore Jobs</h3>

            <p>
              Find companies and opportunities
              that match your eligibility.
            </p>
          </div>


          <div className="step">
            <div className="step-number">03</div>

            <h3>Apply</h3>

            <p>
              Apply for jobs and track your
              application status.
            </p>
          </div>


          <div className="step">
            <div className="step-number">04</div>

            <h3>Get Hired</h3>

            <p>
              Attend interviews and take the
              next step toward your career.
            </p>
          </div>

        </div>

      </section>


      {/* ================= COMPANIES ================= */}
      <section id="companies" className="section companies">

        <div className="section-heading">

          <span className="section-label">
            TOP RECRUITERS
          </span>

          <h2>
            Connect With
            <span> Leading Companies</span>
          </h2>

        </div>


        <div className="company-grid">

          <div className="company">TCS</div>
          <div className="company">Infosys</div>
          <div className="company">Wipro</div>
          <div className="company">Accenture</div>
          <div className="company">Cognizant</div>
          <div className="company">Capgemini</div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta">

        <h2>
          Ready to Start Your Career?
        </h2>

        <p>
          Create your profile and discover opportunities
          waiting for you.
        </p>

        <Link to="/register" className="cta-btn">
          Create Your Account →
        </Link>

      </section>


      {/* ================= FOOTER ================= */}
      <footer>

        <div className="footer-logo">
          🎓 PlacementHub
        </div>

        <p>
          Connecting students with opportunities
          and building successful careers.
        </p>

        <div className="footer-bottom">
          © 2026 PlacementHub. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;