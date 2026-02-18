import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "./api";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validations = {
    length: form.newPassword.length >= 8,
    number: /[0-9]/.test(form.newPassword),
    special: /[^A-Za-z0-9]/.test(form.newPassword),
    match: form.newPassword !== "" && form.newPassword === form.confirmPassword,
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !validations.length ||
      !validations.number ||
      !validations.special ||
      !validations.match
    ) {
      return toast.error("Please meet all security requirements.");
    }

    setLoading(true);
    try {
      const res = await changePassword(form);
      if (res.success || res.status === 200) {
        toast.success("Security updated! Signing you out...");
        setTimeout(() => navigate("/"), 2500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password.",
      );
      setLoading(false);
    }
  };

  const ChecklistRow = ({ met, text }) => (
    <li
      className={`checklist-text d-flex align-items-center ${
        met ? "text-success-custom" : "text-muted"
      }`}
    >
      <i
        className={`bi ${met ? "bi-check-circle-fill" : "bi-circle"} me-2 fs-5`}
      ></i>
      {text}
    </li>
  );

  return (
    <div className="bg-white min-vh-100">
      <nav className="navbar navbar-light bg-white border-bottom px-4 py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-link text-dark text-decoration-none p-0 fw-medium"
          >
            <i className="bi bi-arrow-left me-2"></i> Account Settings
          </button>
          <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
            Security Priority: High
          </span>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {/* Title Section */}
            <div className="mb-5">
              <h2 className="fw-bold text-dark mb-2">Change your password</h2>
              <p className="text-muted">
                Ensure your account is using a long, random password to stay
                secure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="row g-4">
              {/* Left Column: Form Fields */}
              <div className="col-lg-7">
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-1">
                    Current Password
                  </label>
                  <div className="input-group border rounded-3 focus-ring-custom">
                    <span className="input-group-text bg-transparent border-0">
                      <i className="bi bi-key text-muted"></i>
                    </span>
                    <input
                      type={showCurrent ? "text" : "password"}
                      className="form-control border-0 shadow-none py-2"
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn bg-transparent border-0 text-muted"
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      <i
                        className={`bi ${
                          showCurrent ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold mb-1">
                    New Password
                  </label>
                  <div className="input-group border rounded-3 focus-ring-custom">
                    <span className="input-group-text bg-transparent border-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showNew ? "text" : "password"}
                      className="form-control border-0 shadow-none py-2"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn bg-transparent border-0 text-muted"
                      onClick={() => setShowNew(!showNew)}
                    >
                      <i
                        className={`bi ${showNew ? "bi-eye-slash" : "bi-eye"}`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold mb-1">
                    Confirm New Password
                  </label>
                  <div className="input-group border rounded-3 focus-ring-custom">
                    <span className="input-group-text bg-transparent border-0">
                      <i className="bi bi-shield-check text-muted"></i>
                    </span>
                    <input
                      type={showNew ? "text" : "password"}
                      className="form-control border-0 shadow-none py-2"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="btn btn-dark px-4 py-2 fw-bold rounded-3 shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary px-4 py-2 rounded-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Right Column: Security Guidance */}
              <div className="col-lg-4 offset-lg-1">
                <div className="bg-light p-4 rounded-4 border">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-shield-check me-2"></i> Security
                    Checklist
                  </h6>
                  <ul className="list-unstyled mb-4">
                    <ChecklistRow
                      met={validations.length}
                      text="At least 8 characters"
                    />
                    <ChecklistRow
                      met={validations.number}
                      text="Contains a number"
                    />
                    <ChecklistRow
                      met={validations.special}
                      text="Contains a special character"
                    />
                    <ChecklistRow
                      met={validations.match}
                      text="Passwords match exactly"
                    />
                  </ul>

                  <div
                    className="alert alert-info border-0 p-3 small mb-0"
                    style={{ borderRadius: "12px" }}
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
                    <strong>Important:</strong> Changing your password will
                    invalidate all active sessions. You must log back in on all
                    your devices.
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .focus-ring-custom:focus-within {
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
        }
        .checklist-text { font-size: 0.9rem; margin-bottom: 0.75rem; transition: 0.3s; }
        .text-success-custom { color: #198754; font-weight: 500; }
      `}</style>
    </div>
  );
};

export default ChangePassword;
