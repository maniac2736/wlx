import { useEffect, useState } from "react";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./api.js";

import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
} from "docx";

export default function FinanceTracker() {
  const categories = [
    "Salary",
    "Rent",
    "Required Withdraw",
    "Required Deposit",
    "Rent",
    "Mobile TopUp",
    "Other",
  ];

  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]); // FIX ADDED
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    type: "income",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  const [filter, setFilter] = useState({ start: "", end: "" });
  const [summary, setSummary] = useState({ income: 0, expense: 0, net: 0 });

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({});

  // Month-wise
  const [month, setMonth] = useState("");
  const [monthlyData, setMonthlyData] = useState([]);

  // Load paginated data
  const loadData = async (currentPage = page) => {
    setLoading(true);
    const res = await fetchTransactions(currentPage, limit);
    if (res.success) {
      setTransactions(res.data);
      setPagination(res.pagination);
    }
    setLoading(false);
  };

  // Load ALL transactions for summary & month
  const loadAllTransactions = async () => {
    const res = await fetchTransactions(1, 999999); // fetch all
    if (res.success) setAllTransactions(res.data);
  };

  useEffect(() => {
    loadData();
  }, [page]);

  useEffect(() => {
    loadAllTransactions(); // load all once
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      type: form.type,
      amount: form.amount,
      category: form.category,
      date: form.date,
      notes: form.notes,
    };

    let res;
    if (form.id) {
      res = await updateTransaction({ id: form.id, ...payload });
    } else {
      res = await createTransaction(payload);
    }

    if (res.success) {
      setPage(1);
      await loadData(1);
      await loadAllTransactions(); // UPDATE ALL DATA

      setForm({
        id: null,
        type: "income",
        amount: "",
        category: "",
        date: "",
        notes: "",
      });
    }
  };

  const handleEdit = (t) => {
    setForm({
      id: t.id,
      type: t.type,
      amount: t.amount,
      category: t.category,
      date: t.date.slice(0, 10),
      notes: t.notes,
    });
  };

  const handleDelete = async (id) => {
    const res = await deleteTransaction(id);
    if (res.success) {
      setPage(1);
      await loadData(1);
      await loadAllTransactions(); // KEEP ALL DATA UPDATED
    }
  };

  // FIXED SUMMARY — NOW USES ALL DATA
  const calculateSummary = () => {
    if (!filter.start || !filter.end) return;

    const start = new Date(filter.start);
    const end = new Date(filter.end);

    const filtered = allTransactions.filter((t) => {
      const d = new Date(t.date);
      return d >= start && d <= end;
    });

    let income = 0,
      expense = 0;

    filtered.forEach((t) =>
      t.type === "income"
        ? (income += Number(t.amount))
        : (expense += Number(t.amount))
    );

    setSummary({ income, expense, net: income - expense });
  };

  // FIX — MONTHLY ALSO USES ALL DATA
  const handleMonthFetch = () => {
    if (!month) return;
    const [year, selectedMonth] = month.split("-");

    const filtered = allTransactions.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getFullYear() === Number(year) &&
        d.getMonth() + 1 === Number(selectedMonth)
      );
    });

    setMonthlyData(filtered);
  };

  const generateWordDocument = async (data, title, filename) => {
    if (!data.length) return;

    const tableRows = [
      new TableRow({
        children: ["Type", "Amount", "Category", "Date", "Remarks"].map(
          (h) => new TableCell({ children: [new Paragraph(h)] })
        ),
      }),
      ...data.map((t) => {
        const color = t.type === "income" ? "008000" : "FF0000";
        return new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: t.type, color })],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: String(t.amount), color })],
                }),
              ],
            }),
            new TableCell({ children: [new Paragraph(t.category)] }),
            new TableCell({ children: [new Paragraph(t.date.slice(0, 10))] }),
            new TableCell({ children: [new Paragraph(t.notes || "-")] }),
          ],
        });
      }),
    ];

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: title, bold: true, size: 32 })],
            }),
            new Paragraph(" "),
            new Table({ rows: tableRows }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  };

  const downloadWord = () =>
    generateWordDocument(
      allTransactions, // USE ALL DATA
      "All Transactions Report",
      `all-transactions-${Date.now()}.docx`
    );

  const downloadMonthlyWord = () =>
    generateWordDocument(
      monthlyData,
      `Monthly Report - ${month}`,
      `monthly-transactions-${month}.docx`
    );

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4 text-center">Finance Tracker</h2>

      <div className="row">
        {/* FORM */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm mb-4">
            <h5 className="fw-bold text-center mb-3">
              {form.id ? "Edit Transaction" : "Add Transaction"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Remarks</label>
                <textarea
                  className="form-control"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <button className="btn btn-primary w-100">
                {form.id ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>

        {/* TABLE */}
        <div className="col-md-8">
          <div className="shadow-sm">
            <div className="p-3 d-flex justify-content-end gap-2">
              <button className="btn btn-success" onClick={downloadWord}>
                Download All (Word)
              </button>
              <button
                className="btn btn-secondary"
                onClick={downloadMonthlyWord}
                disabled={monthlyData.length === 0}
              >
                Download Monthly (Word)
              </button>
            </div>

            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center">
                  <thead className="table-white">
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-3">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.id}>
                          <td
                            className="fw-semibold text-capitalize"
                            style={{
                              color:
                                t.type === "income"
                                  ? "green"
                                  : t.type === "expense"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {t.type}
                          </td>
                          <td
                            style={{
                              color:
                                t.type === "income"
                                  ? "green"
                                  : t.type === "expense"
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {t.amount}
                          </td>
                          <td>{t.category}</td>
                          <td>{t.date.slice(0, 10)}</td>
                          <td>{t.notes || "-"}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => handleEdit(t)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(t.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span>
                Page {pagination.page || 1} of {pagination.totalPages || 1}
              </span>
              <button
                className="btn btn-secondary"
                disabled={page >= (pagination.totalPages || 1)}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MONTHLY */}
      <div className="mt-5 p-4 bg-white rounded shadow-sm">
        <h5 className="fw-bold text-center mb-3">View Transactions by Month</h5>
        <div className="row mb-3">
          <div className="col-md-4 offset-md-3">
            <label className="form-label">Select Month</label>
            <input
              type="month"
              className="form-control"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-secondary w-100"
              onClick={handleMonthFetch}
            >
              Load
            </button>
          </div>
        </div>
        {month && (
          <div className="mt-3">
            <h6 className="fw-bold">Results:</h6>
            {monthlyData.length === 0 ? (
              <p>No transactions found for this month.</p>
            ) : (
              <ul className="list-group">
                {monthlyData.map((t) => (
                  <li
                    key={t.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>
                      {t.date.slice(0, 10)} - {t.category} ({t.type})
                    </span>
                    <span
                      className={
                        t.type === "income" ? "text-success" : "text-danger"
                      }
                    >
                      {t.type === "income" ? "+" : "-"}
                      {t.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="mt-5 p-4 bg-light rounded shadow-sm">
        <h5 className="fw-bold text-center mb-3">Financial Summary</h5>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={filter.start}
              onChange={(e) => setFilter({ ...filter, start: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={filter.end}
              onChange={(e) => setFilter({ ...filter, end: e.target.value })}
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button
              className="btn btn-primary w-100"
              onClick={calculateSummary}
            >
              Calculate
            </button>
          </div>
        </div>

        <div className="text-center mt-3">
          <h6>
            Total Income:{" "}
            <span className="text-success fw-bold">Rs. {summary.income}</span>
          </h6>
          <h6>
            Total Expense:{" "}
            <span className="text-danger fw-bold">Rs. {summary.expense}</span>
          </h6>

          <h5 className="mt-3 fw-bold">
            {summary.net > 0 && (
              <span className="text-success">Profit: Rs. {summary.net}</span>
            )}
            {summary.net < 0 && (
              <span className="text-danger">
                Loss: Rs. {Math.abs(summary.net)}
              </span>
            )}
            {summary.net === 0 && (
              <span className="text-secondary">Break-even</span>
            )}
          </h5>
        </div>
      </div>
    </div>
  );
}
