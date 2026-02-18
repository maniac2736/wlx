import React, { useEffect, useState, useCallback } from "react";
import {
  fetchAllUsers as fetchAllUsersApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
} from "../../views/UserDashboard/api";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    contact: "",
    email: "",
    username: "",
    role: 1,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllUsersApi();
      if (res.success) setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ ...user });
    setEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating user info...");
    const res = await updateUserApi({ id: selectedUser.id, ...formData });

    if (res.success) {
      toast.update(loadingToast, {
        render: "User updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      fetchUsers();
      setEditModalOpen(false);
    } else {
      toast.update(loadingToast, {
        render: res.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    const res = await deleteUserApi(selectedUser.id);
    if (res.success) {
      toast.success("User account deleted");
      fetchUsers();
      setDeleteModalOpen(false);
    } else {
      toast.error(res.message);
    }
  };

  // Logic for filtering
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());

    const isRegular = user.role === 1;
    const isAdmin = user.role === 2 || user.role === 3;

    return activeTab === "users"
      ? matchesSearch && isRegular
      : matchesSearch && isAdmin;
  });

  const getRoleBadge = (role) => {
    switch (Number(role)) {
      case 3:
        return (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
            Super Admin
          </span>
        );
      case 2:
        return (
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
            Admin
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
            User
          </span>
        );
    }
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">
        {/* Header Section */}
        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold text-dark mb-1">User Management</h2>
            <p className="text-muted small">
              Overview of platform members and permissions
            </p>
          </div>
          <div className="col-md-6">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation Card */}
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="card-header bg-white p-0">
            <ul className="nav nav-tabs border-bottom-0">
              <li className="nav-item">
                <button
                  className={`nav-link px-4 py-3 fw-medium border-0 rounded-0 ${
                    activeTab === "users"
                      ? "active border-bottom border-primary border-3 text-primary"
                      : "text-muted"
                  }`}
                  onClick={() => setActiveTab("users")}
                >
                  <i className="bi bi-people me-2"></i>Regular Users
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link px-4 py-3 fw-medium border-0 rounded-0 ${
                    activeTab === "admins"
                      ? "active border-bottom border-primary border-3 text-primary"
                      : "text-muted"
                  }`}
                  onClick={() => setActiveTab("admins")}
                >
                  <i className="bi bi-shield-lock me-2"></i>Administrators
                </button>
              </li>
            </ul>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="text-muted small text-uppercase">
                  <th className="ps-4">User Details</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      <span className="text-muted">Fetching records...</span>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="bi bi-person-exclamation fs-2 d-block mb-2"></i>
                      No accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="avatar-sm bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-muted small">
                              @{user.username} • {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        <div className="small">
                          <i className="bi bi-telephone me-2 text-muted"></i>
                          {user.contact || "N/A"}
                        </div>
                      </td>
                      <td
                        className="small text-muted text-truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        <i className="bi bi-geo-alt me-1"></i>
                        {user.address || "Global"}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-light btn-sm me-2 text-primary border"
                          onClick={() => openEditModal(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-light btn-sm text-danger border"
                          onClick={() => {
                            setSelectedUser(user);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div
          className="modal show d-block backdrop-blur"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <form onSubmit={handleUpdate}>
                <div className="modal-header border-bottom-0 pt-4 px-4">
                  <h5 className="fw-bold">Update Account Information</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body px-4 pb-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        System Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="form-select border-primary-subtle"
                        required
                      >
                        <option value={1}>Regular User</option>
                        <option value={2}>Administrator</option>
                        <option value={3}>Super Admin</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">
                        Mailing Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="form-control"
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0 px-4 pb-4">
                  <button
                    type="button"
                    className="btn btn-light border px-4"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Discard
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered shadow">
            <div className="modal-content border-0">
              <div className="modal-body p-4 text-center">
                <i className="bi bi-exclamation-triangle text-danger display-4 mb-3"></i>
                <h5 className="fw-bold">Delete Account?</h5>
                <p className="text-muted">
                  You are about to permanently delete{" "}
                  <strong>{selectedUser?.firstName}</strong>. This action cannot
                  be reversed.
                </p>
                <div className="d-flex gap-2 justify-content-center mt-4">
                  <button
                    className="btn btn-light border px-4"
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger px-4"
                    onClick={handleDelete}
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
