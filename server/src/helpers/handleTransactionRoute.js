function handleTransactionRoute(algorithmFunction, options = {}) {
    return (req, res) => {
      const transactions = req.body.transactions;
  
      if (!Array.isArray(transactions)) {
        return res.status(400).json({ error: "Invalid transaction data." });
      }
  
      if (options.maxLength && transactions.length > options.maxLength) {
        return res.status(400).json({ error: "Too many transactions for this method." });
      }
  
      try {
        const result = algorithmFunction(transactions);
        res.json({ result });
      } catch (error) {
        res.status(500).json({ error: "Error processing transactions." });
      }
    };
  }
  
  module.exports = handleTransactionRoute;
  