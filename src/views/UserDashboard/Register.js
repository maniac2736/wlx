import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "./api.js";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    contact: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password Security Validations
  const validations = {
    length: formData.password.length >= 8,
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
    match:
      formData.password !== "" &&
      formData.password === formData.confirmPassword,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const result = await registerUser(formData);

    if (result.success) {
      toast.success(result.message || "Welcome! Registration successful.");
      navigate("/");
    } else {
      toast.error(result.message || "Registration failed.");
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
        className={`bi ${met ? "bi-check-circle-fill" : "bi-circle"} me-2 fs-6`}
      ></i>
      {text}
    </li>
  );

  return (
    <div className="bg-white min-vh-100">
      <nav className="navbar navbar-light bg-white border-bottom px-4 py-3">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand fw-bold text-dark p-0">
            <i className="bi bi-shield-lock-fill me-2"></i>Wallo SecureGate
          </Link>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="mb-5 text-center text-lg-start">
              <h2 className="fw-bold text-dark mb-2">Create your account</h2>
              <p className="text-muted">
                Join us and experience secure management today.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="row g-4">
              {/* Personal Details */}
              <div className="col-lg-7">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">First Name</label>
                    <input
                      type="text"
                      className="form-control py-2 rounded-3"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input
                      type="text"
                      className="form-control py-2 rounded-3"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control py-2 rounded-3"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      className="form-control py-2 rounded-3"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      className="form-control py-2 rounded-3"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Address</label>
                    <input
                      type="text"
                      className="form-control py-2 rounded-3"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Password Section */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group border rounded-3 focus-ring-custom">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-0 shadow-none py-2"
                        name="password"
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
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>
                    <div className="input-group border rounded-3 focus-ring-custom">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-0 shadow-none py-2"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="d-grid pt-4">
                  <button
                    type="submit"
                    className="btn btn-dark py-2 fw-bold rounded-3 shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                  <p className="text-center mt-3 text-muted">
                    Already have an account?{" "}
                    <Link to="/" className="text-dark fw-bold">
                      Login
                    </Link>
                  </p>
                </div>
              </div>

              <div className="col-lg-4 offset-lg-1">
                <div
                  className="bg-light p-4 rounded-4 border sticky-top"
                  style={{ top: "2rem" }}
                >
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-shield-check me-2"></i> Password
                    Requirements
                  </h6>
                  <ul className="list-unstyled mb-0">
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
                  <hr />
                  <div className="small text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Your data is encrypted using industry-standard protocols.
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .focus-ring-custom:focus-within { border-color: #0d6efd !important; box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1); }
        .checklist-text { font-size: 0.85rem; margin-bottom: 0.6rem; transition: 0.3s; }
        .text-success-custom { color: #198754; font-weight: 500; }
        .form-control:focus { border-color: #0d6efd; box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1); }
      `}</style>
    </div>
  );
};

export default Register;
