import { useState, useEffect } from "react";
import { fetchUserProfile } from "./api";

export default function MyCards() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetchUserProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      } else {
        setError(res.message || "Failed to fetch profile");
      }
      setLoading(false);
    };
    getProfile();
  }, []);

  const card = {
    type: "Wallo Platinum",
    lastFour: "1234",
    holder: profile
      ? `${profile.firstName} ${profile.lastName}`
      : "•••••••• ••••••••",
    expires: "12/26",
    cvv: "•••",
    isVirtual: true,
  };

  const actions = [
    { id: 1, label: "Freeze", icon: "bi-lock-fill", color: "#6c757d" },
    { id: 2, label: "Settings", icon: "bi-sliders", color: "#0062ff" },
    { id: 3, label: "New Card", icon: "bi-plus-circle-fill", color: "#0062ff" },
  ];

  const cardDetails = [
    { id: 1, label: "Daily Spending Limit", value: "$5,000.00" },
    { id: 2, label: "Spent Today", value: "$138.39" },
    { id: 3, label: "Card Status", value: "Active", color: "text-success" },
  ];

  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  if (error) return <div className="alert alert-danger mx-3 mt-4">{error}</div>;

  return (
    <div className="container py-4" style={{ maxWidth: "600px" }}>
      {/* Visual Credit Card */}
      <div
        className="p-4 rounded-4 shadow-lg text-white mb-5 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 100%)",
          minHeight: "220px",
          letterSpacing: "1px",
        }}
      >
        {/* Decorative Background Circles */}
        <div
          className="position-absolute"
          style={{
            width: "200px",
            height: "200px",
            background: "rgba(0, 98, 255, 0.2)",
            borderRadius: "50%",
            top: "-50px",
            right: "-50px",
            filter: "blur(40px)",
          }}
        ></div>

        <div className="position-relative z-1 d-flex flex-column justify-content-between h-100">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p
                className="small text-uppercase opacity-75 mb-1"
                style={{ fontSize: "0.7rem" }}
              >
                {card.type}
              </p>
              <h5 className="fw-bold tracking-widest">
                •••• •••• •••• {card.lastFour}
              </h5>
            </div>
            {card.isVirtual && (
              <span
                className="badge border border-white border-opacity-25 rounded-pill fw-light"
                style={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                Virtual Card
              </span>
            )}
          </div>

          <div className="row mt-5">
            <div className="col-7">
              <p
                className="small text-uppercase opacity-50 mb-0"
                style={{ fontSize: "0.6rem" }}
              >
                Card Holder
              </p>
              <p
                className="fw-semibold mb-0"
                style={{ textTransform: "uppercase" }}
              >
                {card.holder}
              </p>
            </div>
            <div className="col-3">
              <p
                className="small text-uppercase opacity-50 mb-0"
                style={{ fontSize: "0.6rem" }}
              >
                Expires
              </p>
              <p className="fw-semibold mb-0">{card.expires}</p>
            </div>
            <div className="col-2">
              <p
                className="small text-uppercase opacity-50 mb-0"
                style={{ fontSize: "0.6rem" }}
              >
                CVV
              </p>
              <p className="fw-semibold mb-0">{card.cvv}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="row g-3 mb-5">
        {actions.map((action) => (
          <div key={action.id} className="col-4 text-center">
            <button className="btn border-0 w-100 p-0 action-wrapper">
              <div
                className="bg-white shadow-sm rounded-4 mb-2 mx-auto d-flex align-items-center justify-content-center"
                style={{ width: "60px", height: "60px", transition: "0.2s" }}
              >
                <i
                  className={`bi ${action.icon} fs-4`}
                  style={{ color: action.color }}
                ></i>
              </div>
              <span className="small fw-bold text-muted">{action.label}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Details List */}
      <div className="bg-white rounded-4 p-4 shadow-sm border border-light">
        <h6 className="fw-bold mb-4 text-dark">Card Management</h6>
        {cardDetails.map((detail, index) => (
          <div key={detail.id}>
            <div className="d-flex justify-content-between align-items-center py-2">
              <span className="text-muted fw-medium">{detail.label}</span>
              <span className={`fw-bold ${detail.color || "text-dark"}`}>
                {detail.value}
              </span>
            </div>
            {index !== cardDetails.length - 1 && (
              <hr className="my-2 opacity-5" />
            )}
          </div>
        ))}
      </div>

      <style>{`
        .action-wrapper:hover div {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0,0,0,0.08) !important;
        }
        .action-wrapper:active div {
          transform: scale(0.95);
        }
        .tracking-widest {
          letter-spacing: 3px;
        }
      `}</style>
    </div>
  );
}
