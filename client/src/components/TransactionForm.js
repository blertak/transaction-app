import React, { useState } from 'react'
import axios from 'axios'
import '../css/TransactionForm.css'

const TransactionForm = () => {
    const [transactions, setTransactions] = useState([
        [2, 1],
        [5, 0],
        [4, 2],
    ])
    const [algorithm, setAlgorithm] = useState('optimized')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleAddTransaction = () => {
        setTransactions([...transactions, ['0', '0']])
    }

    const handleChange = (index, field, value) => {
        const updated = [...transactions]
        updated[index][field] = value === '' ? '' : Number(value)
        setTransactions(updated)
    }

    const handleRemoveTransaction = (index) => {
        const updated = [...transactions]
        updated.splice(index, 1)
        setTransactions(updated)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        const parsedTransactions = transactions.map(([cost, cashback]) => [
            Number(cost),
            Number(cashback),
        ])

        try {
            const endpoint =
                algorithm === 'all'
                    ? '/api/transactions/all'
                    : `/api/transactions/${algorithm}`

            const res = await axios.post(`http://localhost:3030${endpoint}`, {
                transactions: parsedTransactions,
            })

            setResult(
                algorithm === 'all'
                    ? {
                        brute: res.data.bruteForce,
                        naive: res.data.naive,
                        optimized: res.data.optimized,
                    }
                    : { [algorithm]: res.data.result }
            )
        } catch (error) {
            console.error(error)
            const errorMessage =
                error.response?.data?.error || 'An unexpected error occurred.'
            setResult(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const groupedTransactions = []
    for (let index = 0; index < transactions.length; index += 2) {
        const first = transactions[index]
        const second = transactions[index + 1]
        if (second) {
            groupedTransactions.push([first, second])
        } else {
            groupedTransactions.push([first])
        }
    }

    return (
        <div className="transaction-form">
            <h2>Transaction Calculator</h2>

            <form onSubmit={handleSubmit}>
                {groupedTransactions.map((transactions, index) => (
                    <div className='transaction-row-2x'>
                        {transactions.map(([cost, cashback], index) => (
                            <div className='transaction-item'>
                                <div className={`transaction-row ${index % 2 === 1 ? 'transaction-row-right' : ''}`} key={index}>
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
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => handleRemoveTransaction(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                <button type="button" onClick={handleAddTransaction}>
                    ➕ Add Transaction
                </button>

                <div className="algorithm-selector">
                    <label style={{ marginRight: '15px' }}>
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
                    <button type="submit">Calculate</button>
                </div>

            </form>

            {loading && <p className="loading">Loading...</p>}
            {result && typeof result === 'object' && (
                <div className="result">
                    <h3>Minimum Money Required</h3>
                    <p className="explanation">
                        The following values represent the minimum initial amount of money
                        required to successfully complete all transactions using each
                        algorithm.
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
    )
}

export default TransactionForm
