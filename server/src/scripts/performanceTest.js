console.time("Brute Force Execution Time");
console.log("Shuma minimale fillestare (brute force):", bruteForceMinimumMoney([
    [845, 883], [574, 930], [955, 279], [180, 909], [427, 863],
    [818, 912], [225, 941], [53, 40], [256, 1], [60, 422],
    // Add more transactions here to see the time difference
]));
console.timeEnd("Brute Force Execution Time");

console.time("Naive Execution Time");
console.log("Shuma minimale fillestare (naive):", naiveMinimumMoney([
    [845, 883], [574, 930], [955, 279], [180, 909], [427, 863],
    [818, 912], [225, 941], [53, 40], [256, 1], [60, 422],
    // Add same transactions to ensure fair comparison
]));
console.timeEnd("Naive Execution Time");

console.time("Optimized Execution Time");
console.log("Shuma minimale fillestare (optimized):", optimizedMinimumMoney([
    [845, 883], [574, 930], [955, 279], [180, 909], [427, 863],
    [818, 912], [225, 941], [53, 40], [256, 1], [60, 422],
    // Same transaction dataset
]));
console.timeEnd("Optimized Execution Time");