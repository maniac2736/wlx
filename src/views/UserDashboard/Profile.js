import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserProfile, logoutUser } from "./api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);

        const result = await fetchUserProfile();

        if (result?.success) {
          setProfile(result.data);
        } else {
          toast.error(result?.message || "Failed to load profile");

          if (
            result?.status === 401 ||
            result?.status === 403 ||
            result?.status === 404
          ) {
            navigate("/");
          }
        }
      } catch (error) {
        toast.error("Unable to fetch profile data");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const result = await logoutUser();

      if (result?.success) {
        toast.success(result.message || "Logged out successfully");
        navigate("/");
      } else {
        toast.error(result?.message || "Logout failed");
      }
    } catch (error) {
      toast.error("Something went wrong during logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container min-vh-100 d-flex align-items-center justify-content-center">
        <span className="text-muted">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-5 text-center text-muted">
        Profile data not available
      </div>
    );
  }

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4 p-md-5">
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 72, height: 72, fontSize: 28 }}
              >
                {profile.firstName?.[0]}
              </div>
              <h4 className="mb-1 fw-semibold">
                {profile.firstName} {profile.lastName}
              </h4>
              <small className="text-muted">@{profile.username}</small>
            </div>

            {/* Details */}
            <div className="mb-4">
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Email</span>
                <span>{profile.email}</span>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Contact</span>
                <span>{profile.contact || "—"}</span>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Address</span>
                <span className="text-end">{profile.address || "—"}</span>
              </div>

              <div className="d-flex justify-content-between py-2">
                <span className="text-muted">Joined</span>
                <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="d-grid">
              <button
                className="btn btn-outline-danger"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
