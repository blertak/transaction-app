import React, { useState } from 'react';
import axios from 'axios';
import '../css/TransactionForm.css';

const TransactionForm = () => {
    const [transactions, setTransactions] = useState([[2, 1], [5, 0], [4, 2]]);
    const [algorithm, setAlgorithm] = useState('optimized');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAddTransaction = () => {
        setTransactions([...transactions, ['', '']]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...transactions];
        updated[index][field] = value === '' ? '' : Number(value);
        setTransactions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        // Convert strings to numbers before sending
        const parsedTransactions = transactions.map(([cost, cashback]) => [
            Number(cost),
            Number(cashback),
        ]);

        try {
            const endpoint =
                algorithm === 'all'
                    ? '/api/transactions/all'
                    : `/api/transactions/${algorithm}`;

            const res = await axios.post(`http://localhost:3030${endpoint}`, {
                transactions: parsedTransactions,
            });

            console.log("API response:", res.data);

            setResult(
                algorithm === 'all'
                    ? {
                        brute: res.data.bruteForce,
                        naive: res.data.naive,
                        optimized: res.data.optimized,
                    }
                    : { [algorithm]: res.data.result }
            );

        } catch (error) {
            console.error(error);

            const errorMessage =
                error.response?.data?.error || 'An unexpected error occurred.';

            setResult(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transaction-form">
            <h2>Transaction Calculator</h2>

            <form onSubmit={handleSubmit}>
                {transactions.map(([cost, cashback], index) => (
                    <div className="transaction-row" key={index}>
                        <label>
                            Cost:
                            <input
                                type="number"
                                value={cost}
                                onChange={(e) => handleChange(index, 0, e.target.value)}
                            />
                        </label>
                        <label>
                            Cashback:
                            <input
                                type="number"
                                value={cashback}
                                onChange={(e) => handleChange(index, 1, e.target.value)}
                            />
                        </label>
                    </div>
                ))}

                <button type="button" onClick={handleAddTransaction}>
                    ➕ Add Transaction
                </button>

                <div className="algorithm-selector">
                    <label>
                        Algorithm:
                        <select
                            value={algorithm}
                            onChange={(e) => setAlgorithm(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="brute">Brute Force</option>
                            <option value="naive">Naive</option>
                            <option value="optimized">Optimized</option>
                        </select>
                    </label>
                </div>

                <button type="submit">Calculate</button>
            </form>

            {loading && <p className="loading">Loading...</p>}
            {result && typeof result === 'object' && (
                <div className="result">
                    <h3>Minimum Money Required</h3>
                    <p className="explanation">
                        The following values represent the minimum initial amount of money required to successfully complete all transactions using each algorithm.
                    </p>
                    <ul>
                        {Object.entries(result).map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}:</strong> {value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {typeof result === 'string' && <p className="result">{result}</p>}
        </div>
    );
};

export default TransactionForm;
