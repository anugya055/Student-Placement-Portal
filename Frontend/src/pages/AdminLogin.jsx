
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function AdminLogin() {
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
        "http://localhost:5000/api/auth/admin-login",
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
          data.message || "Admin login failed. Please try again."
        );
      }

      // Verify admin authentication response
      if (!data.token || data.admin?.role !== "admin") {
        throw new Error("Invalid admin authentication response.");
      }

      // Store admin details and JWT token
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      // Navigate to Admin Dashboard
      navigate("/admin-dashboard", { replace: true });

    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to server. Please check your backend."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SECTION */}
      <div className="login-left">

        <Link to="/" className="login-logo">
          🎓 PlacementHub
        </Link>

        <div className="login-content">

          <span className="login-badge">
            🛡️ Admin Control Panel
          </span>

          <h1>
            Welcome Admin!
            <span> Manage Placements.</span>
          </h1>

          <p>
            Login to manage student applications, monitor
            placement activities, update application statuses,
            and manage the entire placement process.
          </p>

          <div className="login-benefits">
            <div>
              <span>✓</span>
              Manage student applications
            </div>

            <div>
              <span>✓</span>
              Monitor placement activities
            </div>

            <div>
              <span>✓</span>
              Update application statuses
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="login-right">

        <div className="login-card">

          <div className="form-heading">
            <h2>Admin Login</h2>
            <p>
              Login to your PlacementHub admin account
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="admin-email">
                Email Address
              </label>

              <input
                type="email"
                id="admin-email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="admin-password">
                Password
              </label>

              <input
                type="password"
                id="admin-password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <p role="alert" className="login-error">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Admin Login →"}
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* Student Login Link */}
          <p className="register-text">
            Are you a student?{" "}
            <Link to="/login">
              Student Login
            </Link>
          </p>

          {/* Home Link */}
          <Link to="/" className="back-home">
            ← Back to Home
          </Link>

        </div>
      </div>

    </div>
  );
}

export default AdminLogin;
