const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./src/routes/transactions');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

// Use the main router for all transaction endpoints
app.use(transactionRoutes);

app.listen(PORT, (err) => {
    console.log(`Server is running on http://localhost:${PORT}`, err);
});
