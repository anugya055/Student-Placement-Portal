
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please try again."
        );
      }

      // Save student details returned by the backend.
      // Your backend returns id, name, and email directly.
      const student = {
        id: data.id || data.student?.id || data.student?._id,
        name: data.name || data.student?.name,
        email: data.email || data.student?.email,
      };

      if (!student.id) {
        throw new Error(
          "Login succeeded, but student details were not returned correctly."
        );
      }

      sessionStorage.setItem(
        "student",
        JSON.stringify(student)
      );

      // Navigate to the dashboard after successful login.
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please check your backend."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
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
            <div><span>✓</span> Explore job opportunities</div>
            <div><span>✓</span> Track your applications</div>
            <div><span>✓</span> Manage interview schedules</div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="form-heading">
            <h2>Welcome Back</h2>
            <p>Login to your PlacementHub account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <p role="alert" style={{ color: "red" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/register">Create Account</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
