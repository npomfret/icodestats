function linearRegression(data) {
    // data is an array of points: [ {x, y}... ]

    // step 1: compute the mean for both x and y
    let xSum = 0;
    let ySum = 0;

    for (let {x, y} of data) {
        xSum += x;
        ySum += y;
    }

    const sampleSize = data.length;
    const xMean = xSum / sampleSize;
    const yMean = ySum / sampleSize;

    let num = 0;
    let den = 0;

    for (let {x, y} of data) {
        num += (x - xMean) * (y - yMean);
        den += (x - xMean) * (x - xMean);
    }

    const m = num / den;
    const b = yMean - m * xMean;

    return {m, b}
}

function gradientDescent(data) {
    const learningRate = 0.05;
    const iterations = 100;

    let m = 0;
    let b = 0;

    let results = [];

    for (let i = 0; i < iterations; i++) {
        for (let {x, y} of data) {
            const guess = (m * x) + b;
            const error = y - guess;

            m = m + (error * x * learningRate);
            b = b + error * learningRate;
        }

        results.push({m, b})
    }

    return results;
}
