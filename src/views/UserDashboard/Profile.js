import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser, updateProfileImage } from "./api";
import useUserProfile from "../../components/hooks/fetchProfile";

const Profile = () => {
  const { user: profile, loading: isLoading, error, status } = useUserProfile();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      if (status === 401 || status === 403 || status === 404) {
        navigate("/");
      }
    }
  }, [error, status, navigate]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload an image file");
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewImage(localPreview);
    setSelectedFile(file);
  };

  const handleCancelUpload = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const result = await updateProfileImage(selectedFile);
      if (result.success) {
        toast.success(result.message);
        setSelectedFile(null);
      } else {
        toast.error(result.message);
        handleCancelUpload();
      }
    } catch {
      toast.error("Upload failed");
      handleCancelUpload();
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logoutUser();
      if (result?.success) {
        toast.success(result.message);
        navigate("/");
      } else {
        toast.error(result?.message);
      }
    } catch {
      toast.error("Something went wrong during logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const formattedJoinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  const serverUrl = process.env.SERVER_URL || "http://localhost:4000";

  return (
    <div className="min-vh-100 px-3 py-4">
      <div className="container">
        <div className="mb-5">
          <h1 className="fw-bold text-dark">Account Settings</h1>
          <p className="lead text-muted">
            Manage your personal information and account security.
          </p>
        </div>

        <div className="row gx-4 gy-4">
          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0 rounded-4 sticky-lg-top"
              style={{ top: "2rem" }}
            >
              <div className="card-body p-4 text-center">
                <div className="position-relative d-inline-block mb-3">
                  <div
                    className="rounded-circle bg-dark bg-gradient d-flex align-items-center justify-content-center text-white overflow-hidden shadow-sm"
                    style={{
                      width: "140px",
                      height: "140px",
                      fontSize: "54px",
                      border: selectedFile
                        ? "4px solid #0d6efd"
                        : "4px solid #f8f9fa",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isUploading ? (
                      <div className="spinner-border text-light"></div>
                    ) : previewImage || profile?.image ? (
                      <img
                        src={
                          previewImage
                            ? previewImage
                            : `${serverUrl}${profile.image}`
                        }
                        alt="Profile"
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      profile?.firstName?.charAt(0)?.toUpperCase() || (
                        <i className="bi bi-person"></i>
                      )
                    )}
                  </div>

                  {!selectedFile && (
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle border border-white border-3 d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: "42px", height: "42px" }}
                    >
                      <i className="bi bi-camera-fill"></i>
                    </button>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="d-none"
                  />
                </div>

                {selectedFile && !isUploading && (
                  <div className="mb-3">
                    <p className="small text-primary fw-bold mb-2">
                      Confirm new photo?
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        onClick={handleConfirmUpload}
                        className="btn btn-success btn-sm rounded-pill px-3"
                      >
                        <i className="bi bi-check-lg me-1"></i> Save
                      </button>
                      <button
                        onClick={handleCancelUpload}
                        className="btn btn-light btn-sm rounded-pill px-3 border"
                      >
                        <i className="bi bi-x-lg me-1"></i> Cancel
                      </button>
                    </div>
                  </div>
                )}

                <h2 className="h4 fw-bold text-dark mb-1">
                  @{profile?.username || "User"}
                </h2>
                <div className="mb-4">
                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      profile?.role === 1
                        ? "bg-primary bg-opacity-10 text-primary"
                        : "bg-danger bg-opacity-10 text-danger"
                    }`}
                  >
                    {profile?.role === 1 ? "Member" : "Administrator"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="btn btn-outline-danger w-100 rounded-3 d-flex align-items-center justify-content-center gap-2"
                >
                  {isLoggingOut ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <ul
                className="nav nav-tabs bg-light border-0 px-3 pt-2"
                role="tablist"
              >
                <li className="nav-item">
                  <button
                    className="nav-link active border-0 fw-medium py-3"
                    data-bs-toggle="tab"
                    data-bs-target="#personal"
                  >
                    <i className="bi bi-person me-2"></i>Personal Info
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link border-0 fw-medium py-3"
                    data-bs-toggle="tab"
                    data-bs-target="#security"
                  >
                    <i className="bi bi-shield-lock me-2"></i>Security
                  </button>
                </li>
              </ul>

              <div className="tab-content p-4 p-md-5 bg-white">
                <div className="tab-pane fade show active" id="personal">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="h5 fw-bold mb-0">General Information</h3>
                    <button
                      onClick={() => navigate("/edit-profile")}
                      className="btn btn-sm btn-dark px-3 rounded-pill"
                    >
                      <i className="bi bi-pencil-square me-2"></i>Edit
                    </button>
                  </div>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="small text-muted text-uppercase fw-bold mb-1 d-block">
                        Full Name
                      </label>
                      <p className="text-dark fw-medium border-bottom pb-2">
                        {profile?.firstName} {profile?.lastName || "Not set"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="small text-muted text-uppercase fw-bold mb-1 d-block">
                        Email Address
                      </label>
                      <p className="text-dark fw-medium border-bottom pb-2">
                        {profile?.email}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="small text-muted text-uppercase fw-bold mb-1 d-block">
                        Phone Number
                      </label>
                      <p className="text-dark fw-medium border-bottom pb-2">
                        {profile?.contact || "Not provided"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="small text-muted text-uppercase fw-bold mb-1 d-block">
                        Member Since
                      </label>
                      <p className="text-dark fw-medium border-bottom pb-2">
                        {formattedJoinDate}
                      </p>
                    </div>
                    <div className="col-12">
                      <label className="small text-muted text-uppercase fw-bold mb-1 d-block">
                        Location
                      </label>
                      <p className="text-dark fw-medium border-bottom pb-2">
                        {profile?.address || "No address saved"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="security">
                  <h3 className="h5 fw-bold mb-4">Account Security</h3>
                  <div className="list-group list-group-flush">
                    <Link
                      to="/change-password"
                      size="sm"
                      className="list-group-item list-group-item-action border-0 px-0 d-flex justify-content-between align-items-center py-3"
                    >
                      <div>
                        <p className="mb-0 fw-bold">Update Password</p>
                        <small className="text-muted">
                          Change your account login password
                        </small>
                      </div>
                      <i className="bi bi-chevron-right"></i>
                    </Link>
                    <div className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center py-3 opacity-50">
                      <div>
                        <p className="mb-0 fw-bold">
                          Two-Factor Authentication
                        </p>
                        <small className="text-muted">
                          Currently unavailable
                        </small>
                      </div>
                      <span className="badge bg-secondary">Coming Soon</span>
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

export default Profile;
