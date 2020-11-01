function mean(data) {
    let sumX = 0;
    let sumY = 0;

    for (let {x, y} of data) {
        sumX += x;
        sumY += y;
    }

    const meanX = sumX / data.length;
    const meanY = sumX / data.length;

    return {x: meanX, y: meanY}
}

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

    let numerator = 0;
    let denominator = 0;

    for (let {x, y} of data) {
        numerator += (x - xMean) * (y - yMean);
        denominator += (x - xMean) * (x - xMean);
    }

    const m = numerator / denominator;
    const b = yMean - m * xMean;

    return {m, b}
}

function gradientDescent(
    data,
    learningRate = 0.05,
    iterations = 100,
    initialGuess = {m: 0, b: 0}
) {

    if (data.length < 2)
        return [];

    const output = [];

    for (let i = 0; i < iterations; i++) {
        // start with the result from the previous iteration (or our initial guess)
        let {m, b} = output[output.length - 1] || initialGuess;

        let error;

        for (let {x, y} of data) {
            const guess = (m * x) + b;
            error = y - guess;

            m = m + (error * x * learningRate);
            b = b + (error * learningRate);
        }

        output.push({m, b, error});
    }

    return output;
}
