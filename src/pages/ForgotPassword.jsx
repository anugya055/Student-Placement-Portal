import React, { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage(
      "If an account exists with this email, a password reset link will be sent."
    );
  };

  return (
    <div className="forgot-page">

      {/* ================= LEFT SECTION ================= */}

      <div className="forgot-left">

        <div className="forgot-brand">
          🎓 <span>PlacementHub</span>
        </div>

        <div className="forgot-left-content">

          <div className="forgot-badge">
            🔐 Account Recovery
          </div>

          <h1>
            Don't Worry.
            <span>We've Got You Covered.</span>
          </h1>

          <p>
            Forgot your password? Enter the email address
            associated with your PlacementHub account and
            we'll help you get back into your account.
          </p>


          <div className="security-features">

            <div className="security-item">

              <div className="security-icon">
                🔒
              </div>

              <div>
                <h3>Secure Recovery</h3>

                <p>
                  Your account information stays protected.
                </p>
              </div>

            </div>


            <div className="security-item">

              <div className="security-icon">
                📧
              </div>

              <div>
                <h3>Email Verification</h3>

                <p>
                  We'll send recovery instructions to your email.
                </p>
              </div>

            </div>


            <div className="security-item">

              <div className="security-icon">
                ⚡
              </div>

              <div>
                <h3>Quick Recovery</h3>

                <p>
                  Get back to your account in just a few steps.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ================= RIGHT SECTION ================= */}

      <div className="forgot-right">

        <div className="forgot-card">

          {/* Icon */}

          <div className="forgot-icon">
            🔑
          </div>


          {/* Header */}

          <div className="forgot-header">

            <h2>
              Forgot Password?
            </h2>

            <p>
              Enter your registered email address and
              we'll send you a password reset link.
            </p>

          </div>


          {/* Form */}

          <form onSubmit={handleSubmit}>

            <div className="forgot-form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            <button
              type="submit"
              className="reset-btn"
            >
              Send Reset Link →
            </button>

          </form>


          {/* Message */}

          {message && (
            <div className="reset-message">
              ✓ {message}
            </div>
          )}


          {/* Back to Login */}

          <div className="back-login">

            <a href="/login">
              ← Back to Login
            </a>

          </div>


          {/* Back Home */}

          <div className="forgot-home">

            <a href="/">
              Back to Home
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;