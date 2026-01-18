const express = require("express");
const FinanceController = require("../controller/finance-controller");

const router = express.Router();

router.post("/create", FinanceController.createTransaction);
router.get("/fetch", FinanceController.getAllTransactions);
router.put("/update/:id", FinanceController.updateTransaction);
router.delete("/delete/:id", FinanceController.deleteTransaction);

module.exports = router;
