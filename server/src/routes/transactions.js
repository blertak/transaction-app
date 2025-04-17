const express = require("express");
const router = express.Router();
const {
    bruteForceMinimumMoney,
    naiveMinimumMoney,
    optimizedMinimumMoney
} = require("../core/transactionEngine");
const handleTransactionRoute = require("../helpers/handleTransactionRoute");


// POST /api/transactions/all
router.post("/api/transactions/all", (req, res) => {
    const transactions = req.body.transactions;

    if (!Array.isArray(transactions)) {
        return res.status(400).json({ error: "Invalid transaction data." });
    }

    try {
        const bruteForceResult =
            transactions.length <= 10
                ? bruteForceMinimumMoney(transactions)
                : "Skipped (too large for brute force)";

        const naiveResult = naiveMinimumMoney(transactions);
        const optimizedResult = optimizedMinimumMoney(transactions);

        res.json({
            bruteForce: bruteForceResult,
            naive: naiveResult,
            optimized: optimizedResult
        });
    } catch (err) {
        res.status(500).json({ error: "Error processing transactions." });
    }
});

router.post("/api/transactions/brute", handleTransactionRoute(bruteForceMinimumMoney, { maxLength: 10 }));
router.post("/api/transactions/naive", handleTransactionRoute(naiveMinimumMoney));
router.post("/api/transactions/optimized", handleTransactionRoute(optimizedMinimumMoney));

module.exports = router;
