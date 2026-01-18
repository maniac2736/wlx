const { Transaction } = require("../models");

module.exports.getAllTransactions = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query; // default values
    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    const { rows: transactions, count } = await Transaction.findAndCountAll({
      order: [["date", "DESC"]],
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      transactions,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.createTransaction = async (req, res) => {
  try {
    console.log(req.body);

    const { type, amount, category, date, notes } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields!",
      });
    }

    const transaction = await Transaction.create({
      type,
      amount,
      category,
      date,
      notes,
    });
    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, date, notes } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    await transaction.update({ type, amount, category, date, notes });
    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    await transaction.destroy();
    res
      .status(200)
      .json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
