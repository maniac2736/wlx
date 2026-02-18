import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateOwnProfile } from "./api";
import useUserProfile from "../../components/hooks/fetchProfile";

const EditProfile = () => {
  const {
    user: profile,
    loading: isLoading,
    refreshProfile,
  } = useUserProfile();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        contact: profile.contact || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateOwnProfile(formData);

      if (res.success) {
        refreshProfile(false);

        setTimeout(() => {
          setSaving(false);
          toast.success("Profile updated successfully");
        }, 1500);
      } else {
        toast.error(res.message || "Update failed");
        setSaving(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="text-center py-5 mt-5">
        <div className="spinner-border"></div>
      </div>
    );

  return (
    <div className="bg-white min-vh-100">
      {/* Navigation Header */}
      <nav className="navbar navbar-light bg-white border-bottom px-4 py-3">
        <div className="container-fluid d-flex justify-content-between">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-link text-dark text-decoration-none p-0 fw-medium"
          >
            <i className="bi bi-arrow-left me-2"></i> Back to Profile
          </button>
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
            Edit Mode
          </span>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="mb-5">
              <h2 className="fw-bold text-dark mb-2">
                Update Personal Details
              </h2>
              <p className="text-muted">
                Keep your contact information up to date to ensure account
                security.
              </p>
            </div>

            <form onSubmit={handleSave} className="row g-4">
              <div className="col-lg-7">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control py-2 rounded-3"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control py-2 rounded-3"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Phone Number
                    </label>
                    <div className="input-group border rounded-3 focus-ring-custom">
                      <span className="input-group-text bg-transparent border-0">
                        <i className="bi bi-telephone text-muted"></i>
                      </span>
                      <input
                        type="text"
                        name="contact"
                        className="form-control border-0 shadow-none py-2"
                        value={formData.contact}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Residential Address
                    </label>
                    <div className="input-group border rounded-3 focus-ring-custom">
                      <span className="input-group-text bg-transparent border-0">
                        <i className="bi bi-geo-alt text-muted"></i>
                      </span>
                      <input
                        type="text"
                        name="address"
                        className="form-control border-0 shadow-none py-2"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="btn btn-dark px-4 py-2 fw-bold rounded-3"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      "Save Changes"
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

              {/* Info Sidebar */}
              <div className="col-lg-4 offset-lg-1">
                <div className="bg-light p-4 rounded-4 border">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-info-circle me-2"></i> Why this matters?
                  </h6>
                  <p className="small text-muted mb-0">
                    Your name and contact details are used for identity
                    verification and communication. Changes here will reflect
                    across your entire account profile instantly.
                  </p>
                  <hr />
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-white p-2 border me-3">
                      <i className="bi bi-shield-check text-success"></i>
                    </div>
                    <span className="small fw-medium">
                      Secure Profile Update
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        .focus-ring-custom:focus-within { border-color: #0d6efd !important; box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1); }
      `}</style>
    </div>
  );
};

export default EditProfile;
