import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "./api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    try {
      setIsSubmitting(true);
      const result = await forgotPassword(email);

      if (result.success) {
        setIsSent(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Connection error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-vh-100">
      <nav className="navbar navbar-light bg-white border-bottom px-4 py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand fw-bold text-dark p-0">
            <i className="bi bi-shield-lock-fill me-2"></i> Wallo SecureGate
          </Link>
        </div>
      </nav>

      <div className="container py-5 mt-lg-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5 col-xl-4">
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark mb-2">Reset Password</h2>
              <p className="text-muted">
                {isSent
                  ? "Check your email for instructions"
                  : "Enter your email to receive a recovery link."}
              </p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-2">
              <div className="card-body p-4">
                {!isSent ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold mb-1">
                        Email Address
                      </label>
                      <div className="input-group border rounded-3 focus-ring-custom">
                        <span className="input-group-text bg-transparent border-0 text-muted">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-0 shadow-none py-2"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark w-100 py-2 fw-bold rounded-3 mb-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        "Send Link"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-3">
                    <i className="bi bi-envelope-check text-success display-4 mb-3"></i>
                    <p className="mb-4">
                      We've sent recovery instructions to{" "}
                      <strong>{email}</strong>.
                    </p>
                    <button
                      onClick={() => setIsSent(false)}
                      className="btn btn-outline-dark btn-sm rounded-pill"
                    >
                      Try another email
                    </button>
                  </div>
                )}

                <div className="text-center mt-2">
                  <Link
                    to="/login"
                    className="text-decoration-none small text-muted"
                  >
                    <i className="bi bi-arrow-left me-1"></i> Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`.focus-ring-custom:focus-within { border-color: #0d6efd !important; box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1); }`}</style>
    </div>
  );
};

export default ForgotPassword;
