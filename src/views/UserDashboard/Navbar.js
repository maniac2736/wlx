import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useUserProfile from "../../components/hooks/fetchProfile";
import { logoutUser } from "./api";
import { toast } from "react-toastify";
import Logo from "../../components/Images/blacklogo.png";

function Navbar() {
  const navigate = useNavigate();
  const { user, loading } = useUserProfile();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    } catch {
      toast.error("Something went wrong during logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 transition-all ${
      isActive
        ? "bg-danger-subtle text-danger fw-bold"
        : "text-secondary fw-medium hover-bg-light"
    }`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2">
      <div className="container">
        <NavLink
          className="navbar-brand d-flex align-items-center me-5"
          to="/app/home"
        >
          <img
            src={Logo}
            alt="WalloX"
            style={{
              height: "35px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </NavLink>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <i className="bi bi-list fs-2"></i>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav gap-2 me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/app/home" className={linkClass}>
                <i className="bi bi-grid-1x2"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/app/card" className={linkClass}>
                <i className="bi bi-wallet2"></i>
                <span>Wallets</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/app/activity" className={linkClass}>
                <i className="bi bi-lightning-charge"></i>
                <span>Activity</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/app/read-blogs" className={linkClass}>
                <i className="bi bi-journal-text"></i>
                <span>Articles</span>
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 gap-md-3">
            {/* Theme Toggle */}
            <button
              className="btn btn-light rounded-circle p-2"
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ width: "40px", height: "40px" }}
              title="Toggle Theme"
            >
              <i
                className={`bi ${
                  isDarkMode
                    ? "bi-moon-stars-fill text-primary"
                    : "bi-sun-fill text-warning"
                }`}
              ></i>
            </button>

            {/* Notifications */}
            <button
              className="btn btn-light rounded-circle position-relative p-2"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="bi bi-bell text-secondary"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1"></span>
            </button>

            {/* User Dropdown */}
            <div className="dropdown">
              <button
                className="btn d-flex align-items-center gap-2 p-1 pe-2 rounded-pill border bg-light"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div
                  className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: "32px", height: "32px", fontSize: "11px" }}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></span>
                  ) : (
                    getInitials(user?.firstName)
                  )}
                </div>
                <span className="small fw-semibold text-dark d-none d-sm-inline">
                  {loading ? "Loading..." : user?.firstName || "Guest User"}
                </span>
                <i className="bi bi-chevron-down small text-muted"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 p-2 rounded-3">
                <li>
                  <NavLink
                    className="dropdown-item rounded-2 py-2"
                    to="/app/profile"
                  >
                    <i className="bi bi-person me-2"></i> My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="dropdown-item rounded-2 py-2"
                    to="/app/settings"
                  >
                    <i className="bi bi-gear me-2"></i> Settings
                  </NavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="btn btn-outline-danger w-100 rounded-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    {isLoggingOut ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-right me-2"></i> Log Out
                      </>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-bg-light:hover { background-color: #f8f9fa; color: #dc3545 !important; }
        .navbar-brand { letter-spacing: -0.5px; }
        .dropdown-item:active { background-color: #dc3545; }
        .nav-link { font-size: 0.95rem; }
        .bg-danger-subtle { background-color: rgba(220, 53, 69, 0.1) !important; }
      `}</style>
    </nav>
  );
}

export default Navbar;
