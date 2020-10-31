function linearRegression(data) {
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
