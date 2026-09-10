import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-left">

        <Link to="/" className="login-logo">
          🎓 PlacementHub
        </Link>

        <div className="login-content">

          <span className="login-badge">
            🎓 Student Placement Portal
          </span>

          <h1>
            Welcome Back!
            <span> Continue Your Journey.</span>
          </h1>

          <p>
            Login to explore placement opportunities, track your
            applications, manage interviews, and take the next step
            toward your dream career.
          </p>

          <div className="login-benefits">

            <div>
              <span>✓</span>
              Explore job opportunities
            </div>

            <div>
              <span>✓</span>
              Track your applications
            </div>

            <div>
              <span>✓</span>
              Manage interview schedules
            </div>

          </div>

        </div>

      </div>


      {/* Right Side */}
      <div className="login-right">

        <div className="login-card">

          <div className="form-heading">

            <h2>Welcome Back</h2>

            <p>
              Login to your PlacementHub account
            </p>

          </div>


          <form>

            {/* Email */}
            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                type="email"
                id="email"
                placeholder="Enter your email"
              />

            </div>


            {/* Password */}
            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                placeholder="Enter your password"
              />

            </div>


            {/* Remember + Forgot */}
            <div className="form-options">

              <label className="remember">

                <input type="checkbox" />

                <span>Remember me</span>

              </label>
              <a href="/forgot-password">
                Forgot Password?
              </a>

            </div>


            {/* Login Button */}
            <button
              type="submit"
              className="login-submit"
            >
              Login →
            </button>

          </form>


          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>


          {/* Register */}
          <p className="register-text">

            Don't have an account?

            <Link to="/register">
              Create Account
            </Link>

          </p>


          {/* Back Home */}
          <Link to="/" className="back-home">
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;