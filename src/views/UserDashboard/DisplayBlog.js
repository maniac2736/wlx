import React, { useEffect, useState, useCallback } from "react";
import { fetchPosts } from "../Blog/blogApi";

const serverUrl = process.env.SERVER_URL || "http://localhost:4000";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPosts();
      if (res.success) {
        setPosts(res.data.filter((p) => p.published));
      }
    } catch (err) {
      console.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /* ================= FULL POST VIEW ================= */
  if (selectedPost) {
    return (
      <div className="bg-white min-vh-100">
        <article className="container py-5">
          <header className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">
              {selectedPost.PostSections?.[0]?.title}
            </h1>
            <div className="d-flex justify-content-center align-items-center gap-3 text-muted">
              <span className="small">
                <i className="bi bi-calendar3 me-2"></i>
                {new Date(selectedPost.createdAt).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </span>
              <span className="small text-primary fw-semibold">
                #{selectedPost.slug}
              </span>
            </div>
          </header>

          {selectedPost.PostSections?.map((section, idx) => (
            <section
              key={section.id || idx}
              className="row align-items-center g-5 mb-5 py-4"
            >
              <div
                className={`col-lg-6 ${
                  idx % 2 === 0 ? "order-lg-1" : "order-lg-2"
                }`}
              >
                <div className="overflow-hidden rounded-4 shadow-lg">
                  {section.PostImages?.[0] ? (
                    <img
                      src={`${serverUrl}${section.PostImages[0].image_url}`}
                      alt={section.title}
                      className="img-fluid w-100 hover-zoom"
                      style={{ minHeight: "350px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{ height: "350px" }}
                    >
                      <i className="bi bi-image text-muted fs-1"></i>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`col-lg-6 ${
                  idx % 2 === 0
                    ? "order-lg-2 text-lg-start"
                    : "order-lg-1 text-lg-end"
                }`}
              >
                <h2 className="fw-bold h1 mb-4">{section.title}</h2>
                <p
                  className="lead text-secondary lh-lg"
                  style={{ textAlign: "justify" }}
                >
                  {section.body}
                </p>
              </div>
            </section>
          ))}

          <footer className="mt-5 pt-5 border-top text-center">
            <button
              className="btn btn-dark rounded-pill px-5 py-3 shadow-sm"
              onClick={() => setSelectedPost(null)}
            >
              Return to Gallery
            </button>
          </footer>
        </article>
      </div>
    );
  }

  /* ================= GRID LIST VIEW ================= */
  return (
    <div className="bg-light min-vh-100 pb-5">
      <section className="bg-white py-5 mb-5 border-bottom">
        <div className="container text-center py-2">
          <h2 className="display-6 fw-bold mb-3">Our Journal</h2>
          <p
            className="text-muted lead mx-auto"
            style={{ maxWidth: "550px", fontSize: "1.1rem" }}
          >
            Explore our latest stories, insights, and technological
            breakthroughs.
          </p>
        </div>
      </section>

      <div className="container">
        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-primary border-width-3"
              role="status"
            ></div>
            <p className="mt-3 text-muted">Syncing the latest updates...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-journal-x fs-1 text-muted"></i>
            <p className="mt-2 h5">No articles found.</p>
          </div>
        ) : (
          <div className="row g-4">
            {posts.map((post) => {
              const firstSection = post.PostSections?.[0];
              return (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm overflow-hidden hover-up transition-all">
                    <div
                      className="position-relative overflow-hidden"
                      style={{ height: "240px" }}
                    >
                      {firstSection?.PostImages?.[0] ? (
                        <img
                          src={`${serverUrl}${firstSection.PostImages[0].image_url}`}
                          className="card-img-top h-100 w-100 object-fit-cover"
                          alt={firstSection.title}
                        />
                      ) : (
                        <div className="bg-secondary d-flex align-items-center justify-content-center h-100">
                          <i className="bi bi-book text-white fs-1"></i>
                        </div>
                      )}
                      <div className="position-absolute bottom-0 start-0 p-3 w-100 bg-gradient-dark text-white">
                        <span className="badge bg-primary rounded-pill small mb-2">
                          New Release
                        </span>
                      </div>
                    </div>

                    <div className="card-body p-4 d-flex flex-column">
                      <h4 className="card-title fw-bold mb-3">
                        {firstSection?.title}
                      </h4>
                      <p className="card-text text-muted line-clamp-3 mb-4">
                        {firstSection?.body?.substring(0, 140)}...
                      </p>

                      <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                        <div className="small text-muted">
                          <i className="bi bi-clock me-1"></i> 5 min read
                        </div>
                        <button
                          className="btn btn-outline-dark btn-sm rounded-pill px-4"
                          onClick={() => {
                            setSelectedPost(post);
                            window.scrollTo(0, 0);
                          }}
                        >
                          Read Article
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .hover-up { transition: transform 0.3s ease; }
        .hover-up:hover { transform: translateY(-10px); }
        .object-fit-cover { object-fit: cover; }
        .bg-gradient-dark { background: linear-gradient(transparent, rgba(0,0,0,0.7)); }
        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;  
            overflow: hidden;
        }
        .tracking-wider { letter-spacing: 0.1rem; }
      `}</style>
    </div>
  );
};

export default BlogList;
