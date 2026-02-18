import React, { useState, useMemo } from "react";

export default function Activity({ initialTransactions }) {
  const [transactions, setTransactions] = useState(
    initialTransactions || [
      {
        id: 1,
        title: "Starbucks",
        date: "Nov 26",
        amount: -8.4,
        type: "expense",
      },
      {
        id: 2,
        title: "Salary from XYZ",
        date: "Nov 25",
        amount: 3200,
        type: "income",
      },
      {
        id: 3,
        title: "Amazon",
        date: "Nov 24",
        amount: -129.99,
        type: "expense",
      },
    ]
  );

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesFilter = filter === "all" || filter === t.type;
      const matchesSearch = t.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [filter, search, transactions]);

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Activity</h3>

      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="flex-grow-1">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-light rounded-circle">
          <i className="bi bi-arrow-down"></i>
        </button>

        <button className="btn btn-light rounded-circle">
          <i className="bi bi-gear"></i>
        </button>
      </div>

      <div className="d-flex justify-content-between gap-3 mb-4">
        <div
          className={`flex-grow-1 p-3 text-center border rounded-4 ${
            filter === "all" ? "border-primary text-primary" : ""
          }`}
          onClick={() => setFilter("all")}
          style={{ cursor: "pointer" }}
        >
          All
        </div>

        <div
          className={`flex-grow-1 p-3 text-center border rounded-4 ${
            filter === "income" ? "border-success text-success" : "text-success"
          }`}
          onClick={() => setFilter("income")}
          style={{ cursor: "pointer" }}
        >
          Income
        </div>

        <div
          className={`flex-grow-1 p-3 text-center border rounded-4 ${
            filter === "expense" ? "border-danger text-danger" : "text-danger"
          }`}
          onClick={() => setFilter("expense")}
          style={{ cursor: "pointer" }}
        >
          Expense
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-semibold">Recent Activity</h5>
        <a
          href="#"
          className="text-primary small fw-semibold text-decoration-none"
        >
          See All
        </a>
      </div>

      {filteredTransactions.map((t) => (
        <div
          key={t.id}
          className="p-3 mb-3 rounded-4 border d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "48px",
                height: "48px",
                background: "rgba(0,102,255,0.1)",
              }}
            >
              <i className="bi bi-receipt text-primary"></i>
            </div>

            <div>
              <div className="fw-semibold">{t.title}</div>
              <div className="text-muted small">{t.date}</div>
            </div>
          </div>

          <div
            className={`fw-semibold ${
              t.amount >= 0 ? "text-success" : "text-danger"
            }`}
          >
            {t.amount >= 0 ? `+$${t.amount}` : `-$${Math.abs(t.amount)}`}
          </div>
        </div>
      ))}
    </div>
  );
}
