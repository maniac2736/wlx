import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "./api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requirements = {
    atLeast8: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[@$!%*#?&]/.test(formData.password),
    matches:
      formData.password !== "" &&
      formData.password === formData.confirmPassword,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !requirements.atLeast8 ||
      !requirements.hasNumber ||
      !requirements.hasSpecial
    ) {
      return toast.error("Please meet all password requirements.");
    }
    if (!requirements.matches) {
      return toast.error("Passwords do not match.");
    }

    try {
      setIsSubmitting(true);
      const result = await resetPassword({
        token,
        password: formData.password,
      });

      if (result.success) {
        toast.success("Password updated successfully!");
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center text-center">
        <div>
          <i className="bi bi-exclamation-octagon text-danger display-1"></i>
          <h2 className="mt-3 fw-bold">Invalid Reset Link</h2>
          <p className="text-muted">This link is invalid or has expired.</p>
          <Link to="/forgot-password" name="btn btn-dark mt-2">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold text-dark">
            <i className="bi bi-shield-lock-fill me-2 text-primary"></i> Wallo
            SecureGate
          </span>
        </div>
      </nav>

      <div className="container py-5 mt-lg-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-11 col-lg-10 col-xl-9">
            <div className="row g-4 align-items-stretch">
              {/* Form Section */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-5">
                    <h3 className="fw-bold mb-2">Set New Password</h3>
                    <p className="text-muted mb-4">
                      Protect your account with a secure password.
                    </p>

                    <form onSubmit={handleSubmit}>
                      {/* New Password with Eye Icon */}
                      <div className="mb-4">
                        <label className="form-label small fw-bold text-secondary">
                          NEW PASSWORD
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control bg-light border-0 py-3 ps-3 rounded-start-3 shadow-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <button
                            className="btn btn-light border-0 px-3 rounded-end-3 text-muted"
                            type="button"
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

                      {/* Confirm Password */}
                      <div className="mb-4">
                        <label className="form-label small fw-bold text-secondary">
                          CONFIRM PASSWORD
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control bg-light border-0 py-3 rounded-3 shadow-none"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-dark w-100 py-3 fw-bold rounded-3 mt-2 shadow"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Requirement Checklist Section */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-5">
                    <div className="d-flex align-items-center mb-4">
                      <i className="bi bi-shield-check text-dark fs-3 me-3"></i>
                      <h5 className="fw-bold mb-0">Password Requirements</h5>
                    </div>

                    <ul className="list-unstyled mb-4">
                      <RequirementItem
                        met={requirements.atLeast8}
                        text="At least 8 characters"
                      />
                      <RequirementItem
                        met={requirements.hasNumber}
                        text="Contains a number"
                      />
                      <RequirementItem
                        met={requirements.hasSpecial}
                        text="Contains a special character"
                      />
                      <RequirementItem
                        met={requirements.matches}
                        text="Passwords match exactly"
                      />
                    </ul>

                    <div className="p-3 bg-light rounded-3 d-flex align-items-start border border-light">
                      <i className="bi bi-info-circle text-primary me-3 mt-1 fs-5"></i>
                      <p className="small text-muted mb-0">
                        Your data is encrypted using industry-standard protocols
                        to ensure your privacy and security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RequirementItem = ({ met, text }) => (
  <li
    className={`d-flex align-items-center mb-3 ${
      met ? "text-dark" : "text-muted"
    }`}
  >
    <i
      className={`bi ${
        met ? "bi-check-circle-fill text-success" : "bi-circle text-secondary"
      } me-3 fs-4`}
    ></i>
    <span className="fw-medium">{text}</span>
  </li>
);

export default ResetPassword;
