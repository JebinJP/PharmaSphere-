const ss = require('simple-statistics');

const predictDemand = (dailySalesData) => {
    // data: [{ date: '2023-01-01', quantity: 10 }, ...]
    if (dailySalesData.length < 2) {
        return { error: 'Not enough data to forecast' };
    }

    // Convert dates to numeric day indices (0, 1, 2...)
    const dataPoints = dailySalesData.map((d, index) => [index, parseFloat(d.quantity)]);

    // Perform Linear Regression
    const line = ss.linearRegression(dataPoints);
    const lineFunc = ss.linearRegressionLine(line);

    // Predict next 7 days
    const lastIndex = dataPoints.length - 1;
    const forecast = [];
    for (let i = 1; i <= 7; i++) {
        const nextIndex = lastIndex + i;
        const predictedQty = Math.max(0, Math.round(lineFunc(nextIndex))); // No negative demand
        forecast.push({ day: i, predictedQty });
    }

    return {
        trend: line.m,
        forecast,
        history: dailySalesData
    };
};

module.exports = { predictDemand };
