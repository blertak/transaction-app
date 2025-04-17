// server/src/core/transactionEngine.js

/**
 * Brute Force approach - O(n!)
 * Generates all permutations and finds the minimal initial balance required.
 */
function bruteForceMinimumMoney(transactions) {
    function generatePermutations(arr, start, end, results) {
        if (start === end) {
            results.push([...arr]);
            return;
        }
        for (let i = start; i <= end; i++) {
            [arr[start], arr[i]] = [arr[i], arr[start]];
            generatePermutations(arr, start + 1, end, results);
            [arr[start], arr[i]] = [arr[i], arr[start]];
        }
    }

    const permutations = [];
    generatePermutations(transactions, 0, transactions.length - 1, permutations);

    let minBalance = Infinity;

    for (const perm of permutations) {
        let currentBalance = 0;
        let requiredBalance = 0;

        for (const [cost, cashback] of perm) {
            if (currentBalance < cost) {
                requiredBalance += cost - currentBalance;
                currentBalance = cost;
            }
            currentBalance = currentBalance - cost + cashback;
        }

        minBalance = Math.min(minBalance, requiredBalance);
    }

    return minBalance;
}

/**
 * Naive approach - O(n²)
 * Simulates the transactions in fixed order.
 */
function naiveMinimumMoney(transactions) {
    let currentBalance = 0;
    let requiredBalance = 0;

    for (const [cost, cashback] of transactions) {
        if (currentBalance < cost) {
            requiredBalance += cost - currentBalance;
            currentBalance = cost;
        }
        currentBalance = currentBalance - cost + cashback;
    }

    return requiredBalance;
}

/**
 * Optimized approach - O(n log n)
 * Sorts transactions based on cost - cashback and separates critical ones.
 */
function optimizedMinimumMoney(transactions) {
    const critical = [];
    const nonCritical = [];

    for (const [cost, cashback] of transactions) {
        if (cost > cashback) {
            critical.push([cost, cashback]);
        } else {
            nonCritical.push([cost, cashback]);
        }
    }

    critical.sort((a, b) => (b[0] - b[1]) - (a[0] - a[1]));

    let balance = 0;
    let requiredBalance = 0;

    for (const [cost, cashback] of [...critical, ...nonCritical]) {
        if (balance < cost) {
            requiredBalance += cost - balance;
            balance = cost;
        }
        balance = balance - cost + cashback;
    }

    return requiredBalance;
}

// Export the algorithms
module.exports = {
    bruteForceMinimumMoney,
    naiveMinimumMoney,
    optimizedMinimumMoney
};
