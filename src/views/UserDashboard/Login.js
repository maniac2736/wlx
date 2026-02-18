import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slices/UserSlice";
import { loginUser } from "./api";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return toast.error("Please fill in all fields");
    }

    try {
      setIsSubmitting(true);
      const result = await loginUser(formData);

      if (result?.success) {
        dispatch(addUser(result.data));
        toast.success("Welcome back!");

        switch (result.data.role) {
          case 1:
            navigate("/app/home");
            break;
          case 2:
          case 3:
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/app/home");
        }
      } else {
        toast.error(result?.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Connection failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white border-bottom px-4 py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand fw-bold text-dark p-0">
            <i className="bi bi-shield-lock-fill me-2"></i> Wallo SecureGate
          </Link>
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
            System Access: Protected
          </span>
        </div>
      </nav>

      <div className="container py-5 mt-lg-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5 col-xl-4">
            {/* Title Section */}
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark mb-2">Sign in</h2>
              <p className="text-muted">
                Enter your details to access your dashboard.
              </p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-2">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-1">
                      Username
                    </label>
                    <div className="input-group border rounded-3 focus-ring-custom">
                      <span className="input-group-text bg-transparent border-0 text-muted">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        name="username"
                        className="form-control border-0 shadow-none py-2"
                        placeholder="your_username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between">
                      <label className="form-label fw-semibold mb-1">
                        Password
                      </label>
                      {/* Redirects to Forgot Password Page */}
                      <Link
                        to="/forgot-password"
                        className="text-decoration-none small text-muted hover-primary"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="input-group border rounded-3 focus-ring-custom">
                      <span className="input-group-text bg-transparent border-0 text-muted">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control border-0 shadow-none py-2"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn bg-transparent border-0 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-dark w-100 py-2 fw-bold rounded-3 shadow-sm mb-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-muted small mb-0">
                      New to the platform?{" "}
                      <Link
                        to="/register"
                        className="text-dark fw-bold text-decoration-none"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-5 text-center">
              <div className="d-flex align-items-center justify-content-center text-muted small">
                <i className="bi bi-shield-shaded me-2"></i>
                End-to-end encrypted session management
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .focus-ring-custom:focus-within {
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
        }
        .form-control::placeholder {
          color: #adb5bd;
          font-size: 0.9rem;
        }
        .hover-primary:hover {
          color: #0d6efd !important;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
