import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import useUserProfile from "../../components/hooks/fetchProfile";
import Logo from "../../components/Images/logowlx.png";

const AdminLayout = () => {
  const { user } = useUserProfile();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-primary text-white"
      : "text-light opacity-75";

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      {/* --- SIDEBAR --- */}
      <aside
        className="bg-dark text-white d-flex flex-column p-3"
        style={{
          width: "260px",
          position: "fixed",
          height: "100vh",
          zIndex: 1000,
        }}
      >
        {/* --- LOGO SECTION --- */}
        <div className="d-flex justify-content-center my-4 p-2">
          <Link to="/admin/dashboard">
            <img
              src={Logo}
              alt="WalloX Logo"
              style={{
                height: "40px", // Balanced height to prevent huge gaps
                width: "auto",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>

        {/* --- NAVIGATION MENU --- */}
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-2">
            <Link
              to="/admin/dashboard"
              className={`nav-link d-flex align-items-center gap-3 py-2 px-3 border-0 ${isActive(
                "/admin/dashboard",
              )}`}
            >
              <i className="bi bi-speedometer2"></i> Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              to="/admin/users"
              className={`nav-link d-flex align-items-center gap-3 py-2 px-3 border-0 ${isActive(
                "/admin/users",
              )}`}
            >
              <i className="bi bi-people"></i> User Management
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              to="/admin/blogs"
              className={`nav-link d-flex align-items-center gap-3 py-2 px-3 border-0 ${isActive(
                "/admin/blogs",
              )}`}
            >
              <i className="bi bi-file-earmark-post"></i> Content / Blogs
            </Link>
          </li>
        </ul>

        <hr className="opacity-25" />

        {/* --- LOGOUT SECTION --- */}
        <div className="px-2 mb-3">
          <button className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-box-arrow-left"></i> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main style={{ marginLeft: "260px", width: "calc(100% - 260px)" }}>
        <header className="navbar navbar-expand bg-white shadow-sm px-4 py-2 mb-4">
          <div className="container-fluid d-flex justify-content-end">
            <div className="d-flex align-items-center gap-3">
              {user && (
                <div className="d-flex align-items-center">
                  <div className="text-end me-3 d-none d-sm-block">
                    <p className="mb-0 small fw-bold text-dark">
                      {user.username || user.firstName}
                    </p>
                    <p
                      className="mb-0 mt-n1 text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Administrator
                    </p>
                  </div>
                  <Link
                    to="/admin/profile"
                    className="text-decoration-none transition-hover"
                  >
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        width: 40,
                        height: 40,
                        fontWeight: "600",
                        border: "2px solid #fff",
                      }}
                    >
                      {user.firstName?.[0].toUpperCase() || "A"}
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="container-fluid px-4 pb-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
