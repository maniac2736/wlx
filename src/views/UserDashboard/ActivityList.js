import { useState } from "react";

const transactions = [
  {
    id: 1,
    title: "Gym Membership",
    date: "Today",
    amount: -50,
    category: "Health",
  },
  {
    id: 2,
    title: "Stock Dividend",
    date: "Nov 25",
    amount: 200,
    category: "Investment",
  },
  {
    id: 3,
    title: "Amazon Purchase",
    date: "Nov 24",
    amount: -45.67,
    category: "Shopping",
  },
  {
    id: 4,
    title: "Freelance Payment",
    date: "Nov 23",
    amount: 500,
    category: "Income",
  },
  {
    id: 5,
    title: "Electricity Bill",
    date: "Nov 22",
    amount: -120.5,
    category: "Utilities",
  },
  {
    id: 6,
    title: "Netflix Subscription",
    date: "Nov 21",
    amount: -15.99,
    category: "Entertainment",
  },
];

// Helper to get icons based on category or amount
const getIcon = (amount) => {
  return amount > 0
    ? "bi-arrow-down-left text-success"
    : "bi-cart3 text-primary";
};

export default function ActivityList() {
  const [showAll, setShowAll] = useState(false);

  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, 3);

  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between align-items-end mb-4 px-1">
        <div>
          <h5 className="mb-0 fw-bold text-dark">Recent Activity</h5>
          <p className="text-muted small mb-0">
            Your latest transactions across all accounts
          </p>
        </div>
        {transactions.length > 3 && (
          <button
            className="btn btn-link text-decoration-none small fw-bold p-0"
            style={{ fontSize: "0.85rem", color: "#0062ff" }}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      <div className="d-flex flex-column gap-2">
        {displayedTransactions.map((t) => (
          <div
            key={t.id}
            className="d-flex justify-content-between align-items-center p-3 transition-all"
            style={{
              cursor: "pointer",
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              border: "1px solid #f0f0f0",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0062ff";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#f0f0f0";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <div className="d-flex align-items-center gap-3">
              {/* Icon Container */}
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: t.amount > 0 ? "#e8f5e9" : "#f0f7ff",
                }}
              >
                <i className={`bi ${getIcon(t.amount)} fs-5`}></i>
              </div>

              <div>
                <div
                  className="fw-bold text-dark mb-0"
                  style={{ fontSize: "0.95rem" }}
                >
                  {t.title}
                </div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  {t.date} • {t.category || "General"}
                </div>
              </div>
            </div>

            <div className="text-end">
              <div
                className={`fw-bold ${
                  t.amount > 0 ? "text-success" : "text-dark"
                }`}
                style={{ fontSize: "1rem" }}
              >
                {t.amount > 0 ? "+" : "-"}$
                {Math.abs(t.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div
                className="text-muted"
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Completed
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
