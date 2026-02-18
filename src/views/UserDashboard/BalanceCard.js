import { useState } from "react";

function formatMoney(show, value, type) {
  if (!show) return "••••••";

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

  return formatted;
}

export default function BalanceCard({
  balance = 100000000,
  income = 985000,
  expenses = 100000,
}) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div
      className="card border-0 shadow-lg overflow-hidden"
      style={{
        borderRadius: "24px",
        background: "linear-gradient(135deg, #0062ff 0%, #0040ff 100%)",
        color: "white",
      }}
    >
      <div className="card-body p-4">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <p
              className="text-uppercase mb-1 opacity-75 fw-semibold ls-wide"
              style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
            >
              Total Portfolio Balance
            </p>
            <h1 className="display-6 fw-bold mb-0">
              {formatMoney(showBalance, balance, "balance")}
            </h1>
          </div>
          <button
            className="btn btn-light btn-sm rounded-circle bg-white bg-opacity-25 border-0 text-white"
            style={{
              width: "40px",
              height: "40px",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setShowBalance(!showBalance)}
            aria-label="Toggle Balance Visibility"
          >
            <i
              className={`bi ${
                showBalance ? "bi-eye-slash-fill" : "bi-eye-fill"
              }`}
            ></i>
          </button>
        </div>

        {/* Stats Grid */}
        <div
          className="row g-0 rounded-4 p-3"
          style={{ background: "rgba(255, 255, 255, 0.1)" }}
        >
          <div className="col-6 border-end border-white border-opacity-10">
            <div className="d-flex align-items-center mb-1">
              <div
                className="bg-success bg-opacity-25 rounded-circle p-1 me-2"
                style={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-arrow-down-left-circle-fill small text-success"></i>
              </div>
              <span className="small opacity-75">Monthly Income</span>
            </div>
            <div className="fs-5 fw-bold ms-4">
              {showBalance ? `+${formatMoney(true, income)}` : "••••••"}
            </div>
          </div>

          <div className="col-6 ps-4">
            <div className="d-flex align-items-center mb-1">
              <div
                className="bg-danger bg-opacity-25 rounded-circle p-1 me-2"
                style={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-arrow-up-right-circle-fill small text-danger"></i>
              </div>
              <span className="small opacity-75">Monthly Expenses</span>
            </div>
            <div className="fs-5 fw-bold ms-4">
              {showBalance ? `-${formatMoney(true, expenses)}` : "••••••"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
