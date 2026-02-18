import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Settings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    activityLog: true,
    publicProfile: false,
    darkMode: false,
    compactView: false,
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    toast.success("Preference updated", { autoClose: 1000 });
  };

  return (
    <div className="min-vh-100 px-3 py-4">
      <div className="container">
        <div className="mb-5 text-center text-lg-start">
          <h1 className="fw-bold text-dark">Settings</h1>
          <p className="lead text-muted">
            Customize your experience and manage application preferences.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
              <div className="card-header bg-white border-bottom p-4">
                <h3 className="h5 fw-bold mb-0">General Preferences</h3>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  <div className="list-group-item p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="fw-bold mb-0">Email Notifications</p>
                      <small className="text-muted">
                        Get updates about your account activity via email.
                      </small>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={settings.emailNotifications}
                        onChange={() => handleToggle("emailNotifications")}
                        style={{
                          width: "2.5em",
                          height: "1.25em",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>

                  <div className="list-group-item p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="fw-bold mb-0">Activity Log</p>
                      <small className="text-muted">
                        Save a history of your actions for security audits.
                      </small>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={settings.activityLog}
                        onChange={() => handleToggle("activityLog")}
                        style={{
                          width: "2.5em",
                          height: "1.25em",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>

                  <div className="list-group-item p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="fw-bold mb-0">Public Profile Visibility</p>
                      <small className="text-muted">
                        Allow other users to search for your profile.
                      </small>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={settings.publicProfile}
                        onChange={() => handleToggle("publicProfile")}
                        style={{
                          width: "2.5em",
                          height: "1.25em",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-white border-bottom p-4">
                <h3 className="h5 fw-bold mb-0">Display Settings</h3>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  <div className="list-group-item p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="fw-bold mb-0">Dark Mode</p>
                      <small className="text-muted">
                        Adjust the interface to be easy on your eyes.
                      </small>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={settings.darkMode}
                        onChange={() => handleToggle("darkMode")}
                        style={{
                          width: "2.5em",
                          height: "1.25em",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>

                  <div className="list-group-item p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="fw-bold mb-0">Compact View</p>
                      <small className="text-muted">
                        Show more content with less padding.
                      </small>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={settings.compactView}
                        onChange={() => handleToggle("compactView")}
                        style={{
                          width: "2.5em",
                          height: "1.25em",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-dark rounded-pill px-4 shadow-sm"
              >
                <i className="bi bi-arrow-left me-2"></i>Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
