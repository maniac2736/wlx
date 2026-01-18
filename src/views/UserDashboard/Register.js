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
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await registerUser(formData);
    console.log(result);

    if (result.success) {
      toast.success(result.message || "User registered successfully");
      navigate("/login");
    } else {
      toast.error(result.message || "Registration failed");
    }
  };

  return (
    <div className="container fluid p-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="border shadow p-4">
            <h2 className="text-center mt-2 mb-5">Register Yourself</h2>

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">First Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Last Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Address</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Contact</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Email</label>
                <div className="col-sm-9">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Username</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Password</label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>

              <div className="mt-3 text-center">
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
