import React, { useEffect, useState, useCallback } from "react";
import { fetchPosts, createPost, updatePost, deletePost } from "./blogApi";
import { toast } from "react-toastify";

const serverUrl = process.env.SERVER_URL || "http://localhost:4000";

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    slug: "",
    published: false,
    sections: [],
  });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPosts();
      if (res.success) setPosts(res.data);
    } catch (err) {
      toast.error("Failed to sync with server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { title: "", body: "", images: [], rawFiles: [] },
      ],
    }));
  };

  const removeSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const updateSection = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const handleImageUpload = (index, e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((f) => URL.createObjectURL(f));

    const newSections = [...formData.sections];
    newSections[index].images = [
      ...(newSections[index].images || []),
      ...newPreviews,
    ];
    newSections[index].rawFiles = [
      ...(newSections[index].rawFiles || []),
      ...files,
    ];

    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.slug) return toast.error("Slug is required");

    setSubmitting(true);
    const toastId = toast.loading(
      editingPost ? "Updating post..." : "Creating post...",
    );

    try {
      const res = editingPost
        ? await updatePost({ id: editingPost.id, ...formData })
        : await createPost(formData);

      if (res.success) {
        toast.update(toastId, {
          render: res.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        resetForm();
        loadPosts();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      toast.update(toastId, {
        render: err.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ slug: "", published: false, sections: [] });
    setEditingPost(null);
  };

  const startEdit = (post) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      published: post.published,
      sections: post.PostSections.map((s) => ({
        title: s.title,
        body: s.body,
        images: s.PostImages.map((img) => img.image_url),
        rawFiles: [],
      })),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async (id) => {
    try {
      const res = await deletePost(id);
      if (res.success) {
        toast.success("Post removed");
        setConfirmDeleteId(null);
        loadPosts();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-0 text-dark">CMS Dashboard</h1>
            <p className="text-muted small">
              Manage your blog content and media
            </p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={addSection}
          >
            <i className="bi bi-plus-circle"></i> New Section
          </button>
        </header>

        <div className="row g-4">
          {/* Editor Sidebar */}
          <div className="col-lg-5">
            <div
              className="card border-0 shadow-sm sticky-top"
              style={{ top: "20px" }}
            >
              <div className="card-header bg-white py-3 border-bottom-0">
                <h5 className="mb-0 fw-bold">
                  {editingPost ? "Edit Article" : "Compose Article"}
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-uppercase">
                    URL Slug
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted small">
                      /blog/
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.slug}
                      onChange={(e) => handleChange("slug", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-check form-switch mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      handleChange("published", e.target.checked)
                    }
                  />
                  <label className="form-check-label fw-medium">
                    Visibility: {formData.published ? "Public" : "Draft"}
                  </label>
                </div>

                {formData.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-3 border rounded mb-3 bg-white shadow-sm"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-light text-dark border">
                        Section {idx + 1}
                      </span>
                      <button
                        className="btn btn-link text-danger p-0"
                        onClick={() => removeSection(idx)}
                      >
                        <i className="bi bi-x-circle-fill"></i>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Header"
                      className="form-control form-control-sm mb-2 fw-bold"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(idx, "title", e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Write content..."
                      className="form-control form-control-sm mb-2"
                      rows="3"
                      value={section.body}
                      onChange={(e) =>
                        updateSection(idx, "body", e.target.value)
                      }
                    />
                    <input
                      type="file"
                      multiple
                      className="form-control form-control-sm mb-2"
                      onChange={(e) => handleImageUpload(idx, e)}
                    />
                    <div className="d-flex flex-wrap gap-1">
                      {section.images.map((img, i) => (
                        <img
                          key={i}
                          src={img.startsWith("http") ? img : img}
                          className="rounded"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                          alt="preview"
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-dark py-2"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Processing..."
                      : editingPost
                      ? "Save Changes"
                      : "Publish Now"}
                  </button>
                  {editingPost && (
                    <button
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                    >
                      Discard Changes
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Post Feed */}
          <div className="col-lg-7">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-grow text-primary" role="status"></div>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 g-3">
                {posts.map((post) => (
                  <div key={post.id} className="col">
                    <div className="card h-100 border-0 shadow-sm overflow-hidden">
                      <div className="position-relative">
                        <img
                          src={
                            post.PostSections?.[0]?.PostImages?.[0]
                              ? `${serverUrl}${post.PostSections[0].PostImages[0].image_url}`
                              : "https://via.placeholder.com/400x200?text=No+Featured+Image"
                          }
                          className="card-img-top"
                          style={{ height: "160px", objectFit: "cover" }}
                          alt="preview"
                        />
                        <div className="position-absolute top-0 end-0 p-2">
                          <span
                            className={`badge ${
                              post.published
                                ? "bg-success"
                                : "bg-warning text-dark shadow-sm"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      <div className="card-body">
                        <h6 className="fw-bold text-truncate">{post.slug}</h6>
                        <p
                          className="card-text small text-muted text-truncate-3"
                          style={{ minHeight: "4.5em" }}
                        >
                          {post.PostSections?.[0]?.body ||
                            "No description provided."}
                        </p>
                      </div>

                      <div className="card-footer bg-white border-top-0 p-3">
                        {confirmDeleteId === post.id ? (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-danger btn-sm w-100"
                              onClick={() => confirmDelete(post.id)}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn btn-light btn-sm w-100"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between">
                            <button
                              className="btn btn-outline-primary btn-sm px-3"
                              onClick={() => startEdit(post)}
                            >
                              <i className="bi bi-pencil-square me-1"></i> Edit
                            </button>
                            <button
                              className="btn btn-link text-danger btn-sm p-0"
                              onClick={() => setConfirmDeleteId(post.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManager;
