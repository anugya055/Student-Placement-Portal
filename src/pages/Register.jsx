import React, { useState } from "react";
import "./Register.css";

function Register() {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    course: "",
    college: "",
    graduationYear: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Registration Data:", formData);

    alert("Registration successful!");
  };

  return (
    <div className="register-page">

      {/* ================= LEFT SECTION ================= */}

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
              <div className="register-feature-icon">
                💼
              </div>

              <div>
                <h3>Find Opportunities</h3>
                <p>
                  Discover jobs and placement drives.
                </p>
              </div>
            </div>


            <div className="register-feature">
              <div className="register-feature-icon">
                📊
              </div>

              <div>
                <h3>Track Applications</h3>
                <p>
                  Manage your applications easily.
                </p>
              </div>
            </div>


            <div className="register-feature">
              <div className="register-feature-icon">
                🎯
              </div>

              <div>
                <h3>Prepare for Placements</h3>
                <p>
                  Improve your skills and interview preparation.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>


      {/* ================= RIGHT SECTION ================= */}

      <div className="register-right">

        <div className="register-card">

          <div className="register-header">

            <h2>
              Create Account
            </h2>

            <p>
              Join PlacementHub and start your career journey.
            </p>

          </div>


          {/* Registration Form */}

          <form onSubmit={handleSubmit}>


            {/* Full Name */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

            </div>


            {/* Email + Phone */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Course + Graduation */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Course
                </label>

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Course
                  </option>

                  <option value="BCA">
                    BCA
                  </option>

                  <option value="BTech">
                    B.Tech
                  </option>

                  <option value="MCA">
                    MCA
                  </option>

                  <option value="MTech">
                    M.Tech
                  </option>

                  <option value="MBA">
                    MBA
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Graduation Year
                </label>

                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Year
                  </option>

                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>

                </select>

              </div>

            </div>


            {/* College */}

            <div className="form-group">

              <label>
                College / University
              </label>

              <input
                type="text"
                name="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={handleChange}
                required
              />

            </div>


            {/* Password */}

            <div className="form-group">

              <label>
                Password
              </label>

              <div className="password-box">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Confirm Password */}

            <div className="form-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>


            {/* Terms */}

            <div className="terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the
                <a href="#">
                  Terms & Conditions
                </a>
                and
                <a href="#">
                  Privacy Policy
                </a>
              </span>

            </div>


            {/* Register Button */}

            <button
              type="submit"
              className="register-submit"
            >
              Create Account →
            </button>


          </form>


          {/* Login Link */}

          <div className="login-link">

            Already have an account?

            <a href="/login">
              Login
            </a>

          </div>


          {/* Back Home */}

          <a
            href="/"
            className="back-home"
          >
            ← Back to Home
          </a>

        </div>

      </div>

    </div>
  );
}

export default Register;