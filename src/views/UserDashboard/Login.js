import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
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

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const result = await loginUser(formData);

      if (result?.success) {
        dispatch(addUser(result.data));
        toast.success("Login successful");
        navigate("/app");
      } else {
        toast.error(result?.message || "Invalid username or password");
        setFormData({ username: "", password: "" });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-12 col-sm-10 col-md-6 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4 p-md-5">
            <h3 className="text-center mb-4 fw-semibold">Sign in</h3>

            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                  {errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-4">
              <small className="text-muted">
                Don’t have an account?{" "}
                <Link to="/register" className="fw-medium">
                  Register
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
