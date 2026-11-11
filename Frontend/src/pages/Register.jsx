
import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    course: "",
    college: "",
    graduationYear: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const name = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const college = formData.college.trim();
    const phoneDigits = phone.replace(/\D/g, "");

    // Validate required fields
    if (!name || !email || !phone || !college) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validate phone number (Indian 10-digit format)
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      alert("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    // Validate password
    if (formData.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Validate course and graduation year
    if (!formData.course || !formData.graduationYear) {
      alert("Please select your course and graduation year.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password: formData.password,
            phone,
            college,
            course: formData.course,
            graduationYear: Number(formData.graduationYear),
            skills: [],
            resume: "",
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      alert("Registration successful! You can now log in.");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        course: "",
        college: "",
        graduationYear: "",
      });

      setShowPassword(false);

      // Optional: navigate to login after successful registration
      // window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", error);

      if (error instanceof TypeError) {
        alert(
          "Unable to connect to the server. Please ensure your backend is running on port 5000."
        );
      } else {
        alert(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      {/* LEFT SECTION */}
      <div className="register-left">
        <div className="register-brand">
          🎓 <span>PlacementHub</span>
        </div>

        <div className="register-content">
          <div className="register-badge">
            Start Your Career Journey
          </div>

          <h1>
            Build Your Future.
            <span>Get Placed.</span>
          </h1>

          <p>
            Create your student account and unlock placement
            opportunities, job applications, interview tracking,
            and career preparation tools.
          </p>

          <div className="register-features">
            <div className="register-feature">
              <div className="register-feature-icon">💼</div>
              <div>
                <h3>Find Opportunities</h3>
                <p>Discover jobs and placement drives.</p>
              </div>
            </div>

            <div className="register-feature">
              <div className="register-feature-icon">📊</div>
              <div>
                <h3>Track Applications</h3>
                <p>Manage your applications easily.</p>
              </div>
            </div>

            <div className="register-feature">
              <div className="register-feature-icon">🎯</div>
              <div>
                <h3>Prepare for Placements</h3>
                <p>Improve your skills and interview preparation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="register-right">
        <div className="register-card">
          <div className="register-header">
            <h2>Create Account</h2>
            <p>
              Join PlacementHub and start your career journey.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            {/* Email and Phone */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  maxLength={15}
                  required
                />
              </div>
            </div>

            {/* Course and Graduation Year */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course">Course</label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  <option value="BCA">BCA</option>
                  <option value="BTech">B.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="MTech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="graduationYear">
                  Graduation Year
                </label>
                <select
                  id="graduationYear"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
              </div>
            </div>

            {/* College */}
            <div className="form-group">
              <label htmlFor="college">College / University</label>
              <input
                id="college"
                type="text"
                name="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={handleChange}
                autoComplete="organization"
                maxLength={150}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-box">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password (min. 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            {/* Terms */}
            <div className="terms">
              <input
                id="terms"
                type="checkbox"
                required
              />

              <label htmlFor="terms">
                I agree to the{" "}
                <a href="/terms">Terms &amp; Conditions</a>
                {" "}and{" "}
                <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="register-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating Account..."
                : "Create Account →"}
            </button>
          </form>

          {/* Login Link */}
          <div className="login-link">
            Already have an account?{" "}
            <a href="/login">Login</a>
          </div>

          {/* Back Home */}
          <a href="/" className="back-home">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;
